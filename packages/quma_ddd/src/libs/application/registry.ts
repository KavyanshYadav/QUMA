import consul from 'consul';
import 'dotenv/config';

export class Serviceregitry {
  private consul;
  private ttl: number;

  constructor(ttl = 15) {
    this.consul = new consul({
      host: process.env.CONSUL_HOST || '127.0.0.1',
      port: Number(process.env.CONSUL_PORT) || 8500,
    });
  }

  async registerService(
    instanceId: string,
    host: string,
    port: number,
    command: string[]
  ) {
    for (const cmd of command) {
      const key = `command/${cmd}/${instanceId}`;
      await this.consul.kv.set({
        key,
        value: JSON.stringify({ host, port, cmd, instanceId }),
      });
    }
  }

  async heartbeat(instanceId: string, commands: string[]) {
    for (const cmd of commands) {
      const key = `commands/${cmd}/${instanceId}`;
      const value = await this.consul.kv.get(key);
      if (value) {
        await this.consul.kv.set(key, value.Value, { ttl: `${this.ttl}s` });
      }
    }
  }

  async getHandler(commandName: string): Promise<any[]> {
    const res = await this.consul.kv.keys(`command/${commandName}`);
    if (!res) return [];
    const handler = [];
    for (const key of res) {
      const val = await this.consul.kv.get(key);
      if (val?.Value) handler.push(JSON.parse(val.Value));
    }
    return handler;
  }
}
