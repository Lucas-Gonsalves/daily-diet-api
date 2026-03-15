import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyUserId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.userId

  if (!userId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
