import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
    })

    const { name, email } = createUserBodySchema.parse(req.body)

    await knex('users').insert({ name, email })
    const userCreated = await knex('users').where({ email }).first()

    if (!userCreated) {
      return reply.status(500).send({
        message: 'Internal server error.',
      })
    }

    reply.cookie('userId', userCreated.id)

    return reply.status(201).send({
      message: 'User created with success.',
    })
  })
}
