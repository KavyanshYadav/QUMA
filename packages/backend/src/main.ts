import 'reflect-metadata';
import { randomUUID } from 'crypto';
import express from 'express';
import { RequestContext } from '@quma/quma_ddd_base';
import { WinstonAdapter } from '@quma/quma_ddd_base';
import { Logger } from '@quma/quma_ddd_base';
import { UserModule } from './modules/user/user.module';
import { MemoryBus } from '@quma/quma_ddd_base';
import { container } from 'tsyringe';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use((req, res, next) => {
  const requestId = randomUUID();
  RequestContext.runWithContext(
    () => {
      RequestContext.setRequestId(requestId);
      next();
    },
    { requestId }
  );
});

Logger.registerAdapter(new WinstonAdapter());
const memoryBus = new MemoryBus();
container.registerInstance(MemoryBus, memoryBus);

app.get('/', (req, res) => {
  Logger.info('Name', {
    id: 124,
  });
  res.send({ message: 'Hello API' });
});
app.use(new UserModule().router);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
