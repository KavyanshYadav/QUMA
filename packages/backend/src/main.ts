import 'reflect-metadata';

import dotEnv from 'dotenv';

import { randomUUID } from 'crypto';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { RequestContext } from '@quma/quma_ddd_base';
import { WinstonAdapter } from '@quma/quma_ddd_base';
import { Logger } from '@quma/quma_ddd_base';
import { UserModule } from './modules/user/user.module';
import { MemoryBus } from '@quma/quma_ddd_base';
import { container } from 'tsyringe';
import path from 'path';
import { db, initDB } from './db';
import { AuthMoudle } from './modules/auth/auth.module';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

dotEnv.config();

initDB();

const app = express();
const AuthpublicPath = path.join(__dirname, 'public/authWeb');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/web/auth', express.static(AuthpublicPath));

app.get('/web/auth/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/authWeb', 'index.html'));
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

container.register('DrizzleDBinstance', {
  useValue: db,
});

//Logger.disable();

app.get('/', (req, res) => {
  Logger.info('Name', {
    id: 124,
  });
  res.send({ message: 'Hello API' });
});
app.use(new UserModule().router);
app.use(new AuthMoudle().router);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
