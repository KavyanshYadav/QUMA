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
   * Create a TTL-based session that expires automatically
   * if not renewed periodically.
   */
  private async createSession(instanceId: string) {
    const session = await this.consul.session.create({
      name: `session-${instanceId}`,
      ttl: `${this._ttl}s`,
      behavior: 'delete', // Delete keys when session expires
      lockdelay: '1s',
    });
    this.sessionId = session.ID;
    console.log(`[Registry] Created session ${this.sessionId}`);
  }

  async registerService(
    instanceId: string,
    host: string,
    port: number,
    commands: string[]
  ) {
    if (!this.sessionId) await this.createSession(instanceId);

    for (const cmd of commands) {
      const key = `command/${cmd}/${instanceId}`;
      await this.consul.kv.set({
        key,
        value: JSON.stringify({ host, port, cmd, instanceId }),
        acquire: this.sessionId, // Attach to session
      });
    }

    console.log(
      `[Registry] Registered ${commands.length} commands for ${instanceId}`
    );
  }

  async heartbeat() {
    if (!this.sessionId) return;
    try {
      await this.consul.session.renew(this.sessionId);
      // console.log(`[Registry] Heartbeat sent for session ${this.sessionId}`);
    } catch (err) {
      console.error(`[Registry] Failed to renew session`, err);
    }
  }

  async getHandler(commandName: string): Promise<any[]> {
    const keys = await this.consul.kv.keys(`command/${commandName}`);
    if (!keys) return [];

    const handlers = [];
    for (const key of keys) {
      const val = await this.consul.kv.get(key);
      if (val?.Value) handlers.push(JSON.parse(val.Value));
    }
    return handlers;
  }

  async deregister() {
    if (this.sessionId) {
      await this.consul.session.destroy(this.sessionId);
      console.log(`[Registry] Destroyed session ${this.sessionId}`);
      this.sessionId = undefined;
    }
  }
}
