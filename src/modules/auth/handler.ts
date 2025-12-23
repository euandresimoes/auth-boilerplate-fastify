import type { FastifyInstance } from 'fastify';
import type { AuthModel, RequestUser } from './model';
import { service } from './service';
import { authHook } from '../../infra/hooks/auth-hook';

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

  app.get('/profile', { preHandler: authHook }, async function (req, res) {
    const data = req.user as RequestUser;

    const result = await service.profile(data);
    return res.status(result.status).send(result);
  });
}
