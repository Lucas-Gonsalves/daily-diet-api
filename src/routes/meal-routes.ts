import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { knex } from '../database'
import { verifyUserId } from '../middlewares/verify-user-id'

export async function mealRoutes(app: FastifyInstance) {
  app.put('/:id', { preHandler: [verifyUserId] }, async (req, reply) => {
    const getMealIdParamsSchema = z.object({
      id: z.string(),
    })

    const createMealBodySchema = z.object({
      name: z.string().nullable(),
      description: z.string().nullable(),
      isInDiet: z.enum(['yes', 'no']).nullable(),
      date: z.string().nullable(),
    })

    const { userId } = req.cookies
    const { id: mealId } = getMealIdParamsSchema.parse(req.params)
    const newMeal = createMealBodySchema.parse(req.body)

    const mealFinded = await knex('meals')
      .where({
        id: mealId,
        user_id: userId!,
      })
      .first()

    if (!mealFinded) {
      return reply.status(404).send({
        message: 'Meal not founded.',
      })
    }

    await knex('meals')
      .where({
        id: mealId,
        user_id: userId!,
      })
      .update({
        name: newMeal.name ?? mealFinded.name,
        description: newMeal.description ?? mealFinded.description,
        is_in_diet: newMeal.isInDiet ?? mealFinded.is_in_diet,
        date: newMeal.date ?? mealFinded.date,
      })

    reply.status(200).send({
      message: 'Meal updated with success.',
    })
  })

  app.get('/:id', { preHandler: [verifyUserId] }, async (req, reply) => {
    const getMealIdParamsSchema = z.object({
      id: z.string(),
    })

    const { userId } = req.cookies
    const { id: mealId } = getMealIdParamsSchema.parse(req.params)

    const meal = await knex('meals')
      .where({
        id: mealId,
        user_id: userId!,
      })
      .first()

    if (!meal) {
      return reply.status(404).send({
        message: 'Meal not founded.',
      })
    }

    reply.send({
      meal,
    })
  })

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
