import { jwtAuth } from '../../infra/auth/jwt';
import type { ApiResponse } from '../../shared/models/api-response';
import { app } from '../../server';
import type { AuthModel, RequestUser } from './model';
import bcrypt from 'bcrypt';

export const repository = {
  async register(data: AuthModel): Promise<ApiResponse> {
    try {
      const userExists = await app.prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (userExists) {
        return {
          status: 409,
          error: 'email already in use',
        };
      }

      const password_hash = bcrypt.hashSync(data.password, 10);

      const user = await app.prisma.users.create({
        data: {
          email: data.email,
          password_hash,
        },
        select: {
          id: true,
          email: true,
          created_at: true,
        },
      });

      return {
        status: 201,
        message: 'user created',
        data: user,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error',
      };
    }
  },

  async login(data: AuthModel): Promise<ApiResponse> {
    try {
      const user = await app.prisma.users.findUnique({
        where: {
          email: data.email,
        },
        select: {
          id: true,
          email: true,
          password_hash: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          error: 'user not found',
        };
      }

      if (
        data.password !== user.password_hash &&
        !bcrypt.compareSync(data.password, user.password_hash)
      ) {
        return {
          status: 401,
          error: 'invalid credentials',
        };
      }

      const token = jwtAuth.generate({ email: user.email, id: user.id });

      return {
        status: 200,
        data: token,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error',
      };
    }
  },

  async profile(data: RequestUser): Promise<ApiResponse> {
    try {
      const user = await app.prisma.users.findUnique({
        where: {
          id: data.id,
          email: data.email,
        },
        select: {
          id: true,
          email: true,
          created_at: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          error: 'user not found',
        };
      }

      return {
        status: 200,
        message: 'success',
        data: user,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },
};
