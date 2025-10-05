import { Router } from 'express';

export class UserModule {
  public readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/user');
  }
}
