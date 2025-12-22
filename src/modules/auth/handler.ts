import type { FastifyInstance } from 'fastify';
import type { AuthModel } from './model';
import { service } from './service';

export async function authHandler(app: FastifyInstance) {
  app.post('/register', async function (req, res) {
    const data = req.body as AuthModel;

    const result = await service.register(data);
    return res.status(result.status).send(result);
  });

  app.post('/login', async function (req, res) {
    const data = req.body as AuthModel;

    const result = await service.login(data);
    return res.status(result.status).send(result);
  });
}
