import { FastifyRequest } from 'fastify';
import { KubeFastifyInstance, KubeStatus } from '../../../types';
import { createCustomError } from '../../../utils/requestUtils';

export const health = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<{ health: string }> => {
  const kubeContext = fastify.kube.currentContext;
  if (!kubeContext && !kubeContext.trim()) {
    const error = createCustomError('failed to get kube status', 'Failed to get Kube context');
    fastify.log.error(error, 'failed to get status');
    throw error;
  } else {
    return { health: 'ok' };
  }
};
