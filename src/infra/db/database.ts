import { PrismaClient } from '@prisma/client/extension';
import fp from 'fastify-plugin';

const prisma = new PrismaClient();

export const prismaPlugin = fp(async function (fastify, opts) {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async function (fastifyInstance) {
    await prisma.$disconnect();
  });
});
