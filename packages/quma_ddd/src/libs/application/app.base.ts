// core/app.ts
import express, { Express, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { Logger } from '../log/logger.js';
import { MemoryBus, WinstonAdapter } from '../utils/index.js';

export interface Module {
  name?: string;
  router: express.Router;
  onInit?(): Promise<void> | void;
}

export interface AppOptions {
  modules: Module[];
  port?: number;
  host?: string;
  middlewares?: RequestHandler[];
  publicDirs?: Record<string, string>;
}

export class AppBuilder {
  private readonly app: Express;
  private readonly modules: Module[];
  private readonly port: number;
  private readonly host: string;

  constructor(options: AppOptions) {
    this.app = express();
    this.modules = options.modules;
    this.port = options.port ?? 3000;
    this.host = options.host ?? 'localhost';

    this.setupBase();
    if (options.middlewares) this.applyMiddlewares(options.middlewares);
    if (options.publicDirs) this.serveStatic(options.publicDirs);
    this.registerModules();
  }

  /** basic express setup and DDD infra setup */
  private setupBase() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Shared infrastructure
    Logger.registerAdapter(new WinstonAdapter());
    container.registerInstance(MemoryBus, new MemoryBus());
  }

  /** apply custom middlewares */
  private applyMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach((mw) => this.app.use(mw));
  }

  /** serve static directories if provided */
  private serveStatic(dirs: Record<string, string>) {
    for (const [route, dir] of Object.entries(dirs)) {
      this.app.use(route, express.static(dir));
    }
  }

  /** register all modules and call onInit hooks */
  private registerModules() {
    this.modules.forEach((mod) => {
      if (mod.onInit) mod.onInit();
      this.app.use(mod.router);
      Logger.info(`✅ Mounted module: ${mod.name ?? 'unnamed'}`);
    });
  }

  /** start express server */
  public start() {
    this.app.get('/', (_, res) => res.json({ status: 'ok' }));
    this.app.listen(this.port, this.host, () => {
      console.log(`[ ready ] http://${this.host}:${this.port}`);
    });
  }

  /** expose express instance for advanced customizations */
  public get instance(): Express {
    return this.app;
  }
}
