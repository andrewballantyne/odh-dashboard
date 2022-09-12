import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { health } from './healthUtils';

export default async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return health(fastify, request)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        fastify.log.error(`Failed to get status, ${e.response?.data?.message || e.message}}`);
        reply.send(e.response?.data?.message || e.message);
      });
  });
};
