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

    reply.cookie('userId', userCreated?.id)

    reply.status(201).send({
      message: 'User created with success.',
      user: userCreated,
    })
  })
}
