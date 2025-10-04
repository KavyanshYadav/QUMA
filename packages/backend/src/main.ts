import { randomUUID } from 'crypto';
import express from 'express';
import { RequestContext } from './libs/application/context/AppRequestContex';
import { WinstonAdapter } from './libs/utils/adapters/logs/winston_logger';
import { Logger } from './libs/log/logger';

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

app.get('/', (req, res) => {
  Logger.info('Name', {
    id: 124,
  });
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
