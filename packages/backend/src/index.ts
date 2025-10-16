/* eslint-disable @nx/enforce-module-boundaries */
import 'reflect-metadata';
import 'dotenv/config'; // simp
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log();
import { randomUUID } from 'crypto';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { RequestContext } from '@quma/ddd';
import { WinstonAdapter } from '@quma/ddd';
import { Logger } from '@quma/ddd';
import { UserModule } from './modules/user/user.module.js';
import { MemoryBus } from '@quma/ddd';
import { container } from 'tsyringe';
import * as path from 'path';
import { db, initDB } from './db/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AuthMoudle } from './modules/auth/auth.module.js';
import { JWTService } from './modules/auth/services/jwt.service.js';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
initDB();

container.register(JWTService, {
  useClass: JWTService,
});

const app = express();
const AuthpublicPath = path.join(__dirname, 'public/authWeb');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  const requestId = randomUUID();

  RequestContext.runWithContext(
    async () => {
      RequestContext.setRequestId(requestId);
      let authToken = req.headers?.authorization;
      if (!authToken) {
        authToken = '';
        //return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        const jwtService = container.resolve(JWTService);
        const user = await jwtService.verifyToken(authToken);
        RequestContext.setUserId(user.userId);
        req.user = user;
        next();
        return;
      } catch {
        req.user = undefined;
        next();
        return;
      }
    },
    { requestId }
  );
});

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
