import { execSync } from 'node:child_process'

import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../../src/app'

describe('User Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    const user = {
      name: 'Jhon Doe',
      email: 'jhondoe@email.com',
    }
    const response = await request(app.server).post('/users').send(user)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      message: 'User created with success.',
    })
  })

  it('should when creating a new user apply a new cookie in response', async () => {
    const user = {
      name: 'Jhon Doe',
      email: 'jhondoe@email.com',
    }
    const response = await request(app.server).post('/users').send(user)

    const cookies = response.get('Set-Cookie')

    expect(response.statusCode).toBe(201)
    expect(cookies).toHaveLength(1)
    expect(cookies?.[0]).toContain('userId')
  })
})
