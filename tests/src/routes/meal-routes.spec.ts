import { execSync } from 'node:child_process'

import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../../src/app'

describe('Meal Routes', () => {
  const makeSut = async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com',
    })

    const cookies = response.get('Set-Cookie') ?? []

    return { cookies }
  }

  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new meal', async () => {
    const { cookies } = await makeSut()

    const meal = {
      name: 'name-meal-test',
      description: 'description-meal-test',
      isInDiet: false,
      date: new Date(),
    }

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(meal)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      message: 'Meal created with success.',
    })
  })
})
