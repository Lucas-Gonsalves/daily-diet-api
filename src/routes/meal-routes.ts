import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { knex } from '../database'
import { verifyUserId } from '../middlewares/verify-user-id'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [verifyUserId] }, async (req, reply) => {
    const { userId } = req.cookies

    const meals = await knex('meals').where({
      user_id: userId!,
    })

    reply.send({
      meals,
    })
  })

  app.post('/', { preHandler: [verifyUserId] }, async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isInDiet: z.enum(['yes', 'no']),
      date: z.string(),
    })

    const { date, description, isInDiet, name } = createMealBodySchema.parse(
      req.body,
    )

    const { userId } = req.cookies

    await knex('meals').insert({
      user_id: userId!,
      name,
      description,
      is_in_diet: isInDiet,
      date,
    })

    reply.status(201).send({
      message: 'Meal created with success.',
    })
  })
}
