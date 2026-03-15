import cookie from '@fastify/cookie'
import { fastify } from 'fastify'

import { mealRoutes } from './routes/meal-routes'
import { userRoutes } from './routes/user-routes'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealRoutes, {
  prefix: 'meals',
})
