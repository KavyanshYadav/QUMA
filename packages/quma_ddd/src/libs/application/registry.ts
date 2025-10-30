import Consul from 'consul';

export class ServiceRegistry {
  private consul: any;
  private _ttl: number;
  private sessionId?: string;

  constructor(ttl = 15) {
    this._ttl = ttl;
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || '127.0.0.1',
      port: Number(process.env.CONSUL_PORT) || 8500,
    });
  }

  /**
   * Create a TTL-based session that can be used for coordination
   * (kept here for compatibility, though Consul handles TTL via health checks now)
   */
  private async createSession(instanceId: string) {
    const session = await this.consul.session.create({
      name: `session-${instanceId}`,
      ttl: `${this._ttl}s`,
      behavior: 'delete',
      lockdelay: '1s',
    });
    this.sessionId = session.ID;
    console.log(`[Registry] Created session ${this.sessionId}`);
  }

  /**
   * Register a service instance and its command metadata.
   * Uses Consul’s native service registry instead of KV.
   */
  async registerService(
    instanceId: string,
    host: string,
    port: number,
    commands: string[]
  ) {
    if (!this.sessionId) await this.createSession(instanceId);

    const serviceName = `microservice-${instanceId}`;

    await this.consul.agent.service.register({
      id: instanceId,
      name: serviceName,
      address: host,
      port,
      meta: {
        commands: commands.join(','),
      },
      check: {
        http: `http://${host}:${port}/health`,
        interval: `${this._ttl}s`,
        timeout: '5s',
        deregistercriticalserviceafter: '1m',
      },
    });

    console.log(
      `[Registry] Registered service '${serviceName}' with ${commands.length} commands`
    );
  }

  /**
   * Send periodic heartbeat.
   * With service checks, this can also renew session if used.
   */
  async heartbeat() {
    if (this.sessionId) {
      try {
        await this.consul.session.renew(this.sessionId);
        // console.log(`[Registry] Heartbeat renewed session ${this.sessionId}`);
      } catch (err) {
        console.error(`[Registry] Failed to renew session`, err);
      }
    }
  }

  /**
   * Get handlers by command name.
   * It queries Consul’s catalog for all services that list this command.
   */
  async getHandler(commandName: string): Promise<any[]> {
    const allServices = await this.consul.catalog.service.list();
    const handlers: any[] = [];

    for (const serviceName of Object.keys(allServices)) {
      const nodes = await this.consul.catalog.service.nodes(serviceName);
      for (const node of nodes) {
        if (node?.ServiceMeta?.commands?.includes(commandName)) {
          handlers.push({
            host: node.ServiceAddress,
            port: node.ServicePort,
            instanceId: node.ServiceID,
            cmd: commandName,
          });
        }
      }
    }

    return handlers;
  }

  /**
   * Deregister service and destroy session on shutdown.
   */
  async deregister(instanceId?: string) {
    if (instanceId) {
      await this.consul.agent.service.deregister(instanceId);
      console.log(`[Registry] Deregistered service ${instanceId}`);
    }

    if (this.sessionId) {
      await this.consul.session.destroy(this.sessionId);
      console.log(`[Registry] Destroyed session ${this.sessionId}`);
      this.sessionId = undefined;
    }
  }
}
