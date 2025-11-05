import express from 'express';
import { ServiceRegistry } from './registry.js';
import { container } from 'tsyringe';
import { Command } from '../ddd/command.base.js';
import { MemoryBus } from '../utils/index.js';
import { Module } from './module.js';
import { randomUUID } from 'crypto';
import { RequestContext } from './context/AppRequestContex.js';
export class MicroService {
  private app = express();
  private registry = new ServiceRegistry();
  private instanceId: string;
  private modules: Module[] = [];
  private host = process.env.HOST || 'localhost';
  private port = Number(process.env.PORT) || 3000;
  private serviceType: string;
  private readonly commands = new Map<
    new (...args: any[]) => Command,
    string // command -> module name
  >();
  constructor(serviceName: string, instanceId?: string) {
    this.serviceType =
      process.env.SERVICE_NAME || serviceName || 'notDefinedShouldTermiate';
    this.instanceId = randomUUID();
    container.registerInstance(ServiceRegistry, this.registry);
    container.registerInstance(MemoryBus, new MemoryBus(this.registry));
  }

  registerModule(Module: Module) {
    this.modules.push(Module);
  }

  requestContextInit() {
    this.app.use(async (req, res, next) => {
      const requestId = randomUUID();

      RequestContext.runWithContext(
        async () => {
          RequestContext.setRequestId(requestId);
          next();
        },
        { requestId }
      );
    });
  }

  async run(port: number | undefined = Number(process.env.PORT)) {
    this.requestContextInit();

    const commandBus = container.resolve(MemoryBus);
    console.log(this);
    setInterval(() => {
      this.registry.heartbeat();
    }, 7000);

    for (const module of this.modules) {
      await module.init();

      // Mount routes
      this.app.use(module.getRouter());

      // Register commands from module
      for (const [commandClass, handler] of module.getCommands()) {
        commandBus.registerHandler(commandClass, handler);
        console.log(commandClass, handler);
        this.commands.set(commandClass, module.constructor.name);
      }
    }
    await this.registry
      .registerService(
        this.instanceId,
        this.serviceType,
        this.host,
        port || this.port,
        Array.from(this.commands.keys()).map((cmd) => cmd.name)
      )
      .then(() => {
        console.log(this.commands);
        console.log('running a service');
      });

    process.on('SIGTERM', async () => {
      await this.registry.deregister(`${this.serviceType}-${this.instanceId}`);
      console.log(`Deregistered ${this.serviceType}-${this.instanceId}`);
      process.exit(0);
    });
    process.on('SIGINT', async () => {
      await this.registry.deregister(`${this.serviceType}-${this.instanceId}`);
      console.log(`Deregistered ${this.serviceType}-${this.instanceId}`);
      process.exit(0);
    });
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });

    this.app.listen(port, () => {
      console.log(
        `🟢 Microservice ${this.host} ${this.instanceId} running on port ${
          port || this.port
        }`
      );
    });
  }
}
