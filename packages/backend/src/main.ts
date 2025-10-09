import 'reflect-metadata';

import dotEnv from 'dotenv';

import { randomUUID } from 'crypto';
import express from 'express';
import { RequestContext } from '@quma/quma_ddd_base';
import { WinstonAdapter } from '@quma/quma_ddd_base';
import { Logger } from '@quma/quma_ddd_base';
import { UserModule } from './modules/user/user.module';
import { MemoryBus } from '@quma/quma_ddd_base';
import { container } from 'tsyringe';
import path from 'path';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

dotEnv.config();

const app = express();
const AuthpublicPath = path.join(__dirname, 'public/authWeb');

app.use('/web/auth', express.static(AuthpublicPath));

app.get('/web/auth/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

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
