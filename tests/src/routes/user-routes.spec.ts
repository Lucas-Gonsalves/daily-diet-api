import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../src/app'


describe('User Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'Jhon Doe', email: 'jhondoe@email.com' })
    
    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      message: 'User created with success.',
      user: {
        name: 'Jhon Doe',
        email: 'jhondoe@email.com',
      },
    })
  })
  
  it('should when creating a new user apply a new cookie in response', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'Jhon Doe', email: 'jhondoe@email.com' })
    
    const cookies = response.get('Set-Cookie') 

    expect(response.statusCode).toBe(201)
    expect(cookies).toHaveLength(1)
    expect(cookies?.[0]).toContain('userId')
    expect(response.body).toMatchObject({
      message: 'User created with success.',
      user: {
        name: 'Jhon Doe',
        email: 'jhondoe@email.com',
      },
    })
  })
})