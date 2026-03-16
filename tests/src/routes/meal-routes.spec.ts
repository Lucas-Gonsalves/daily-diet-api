import { execSync } from 'node:child_process'

import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../../src/app'

describe('Meal Routes', () => {
  const mealTemplate = {
    name: 'name-meal-test',
    description: 'description-meal-test',
    isInDiet: 'no',
    date: new Date().toISOString(),
  }

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

  it('should creates a meal for an authenticated user', async () => {
    const { cookies } = await makeSut()

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealTemplate)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      message: 'Meal created with success.',
    })
  })

  it('should returns all meals for the authenticated user', async () => {
    const { cookies } = await makeSut()

    const responsePost = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealTemplate)

    const responseGet = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(responsePost.statusCode).toBe(201)
    expect(responseGet.statusCode).toBe(200)
    expect(responseGet.body).toMatchObject({
      meals: [
        {
          name: 'name-meal-test',
          description: 'description-meal-test',
          is_in_diet: 'no',
          date: mealTemplate.date,
        },
      ],
    })
  })

  it('should returns a meal by id for the authenticated user', async () => {
    const { cookies } = await makeSut()

    const responsePost = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealTemplate)

    const responseGet = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const createdMealId = responseGet.body.meals[0].id

    const responseGetById = await request(app.server)
      .get(`/meals/${createdMealId}`)
      .set('Cookie', cookies)

    expect(responsePost.statusCode).toBe(201)
    expect(responseGet.statusCode).toBe(200)
    expect(createdMealId).toBeDefined()
    expect(responseGetById.statusCode).toBe(200)
    expect(responseGetById.body).toMatchObject({
      meal: {
        name: 'name-meal-test',
        description: 'description-meal-test',
        is_in_diet: 'no',
        date: mealTemplate.date,
      },
    })
  })

  it('should update the meal by mealId for the authenticated user', async () => {
    const mealTemplateUpdated = {
      name: 'name-meal-test-updated',
      description: 'description-meal-test-updated',
      isInDiet: 'yes',
      date: new Date().toISOString(),
    }

    const { cookies } = await makeSut()

    const responsePost = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealTemplate)

    const responseGet = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const createdMealId = responseGet.body.meals[0].id

    const responsePut = await request(app.server)
      .put(`/meals/${createdMealId}`)
      .set('Cookie', cookies)
      .send(mealTemplateUpdated)

    expect(responsePost.statusCode).toBe(201)
    expect(responseGet.statusCode).toBe(200)
    expect(createdMealId).toBeDefined()
    expect(responsePut.statusCode).toBe(200)
    expect(responsePut.body).toMatchObject({
      message: 'Meal updated with success.',
    })
  })

  it('should delete the meal by mealId for the authenticated user', async () => {
    const { cookies } = await makeSut()

    const responsePost = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealTemplate)

    const responseGet = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const createdMealId = responseGet.body.meals[0].id

    const respondeDelete = await request(app.server)
      .delete(`/meals/${createdMealId}`)
      .set('Cookie', cookies)

    expect(responsePost.statusCode).toBe(201)
    expect(responseGet.statusCode).toBe(200)
    expect(createdMealId).toBeDefined()
    expect(respondeDelete.statusCode).toBe(204)
  })

  it('should show the metrics of the meals for the authenticated user', async () => {
    const { cookies } = await makeSut()

    const responsePostFirst = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'name-meal-test-first',
        description: 'description-meal-first',
        isInDiet: 'yes',
        date: new Date().toISOString(),
      })

    const responsePostSecond = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'name-meal-test-second',
        description: 'description-meal-second',
        isInDiet: 'no',
        date: new Date().toISOString(),
      })

    const responseGet = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)

    expect(responsePostFirst.statusCode).toBe(201)
    expect(responsePostSecond.statusCode).toBe(201)

    expect(responseGet.statusCode).toBe(200)
    expect(responseGet.body).toMatchObject({
      length: 2,
      totalInDiet: 1,
      totalOutDiet: 1,
      dietSequence: 1,
    })
  })
})
