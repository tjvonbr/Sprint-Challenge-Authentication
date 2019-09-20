const server = require('../api/server.js');
const request = require('supertest');

const Users = require('../users/users-model.js');
const db = require('../database/dbConfig.js');

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  })

  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('insert', () => {
    it('should insert user into db', async () => {
      // insert the record
      await Users.add({
        username: 'ebcoon',
        password: 'challis'
      });

      const users = await db('users');

      // assert the record was inserted
      expect(users).toHaveLength(1);
    });

    it('should insert user into db', async () => {
      // insert the record
      const {id} =  await Users.add({
        username: 'ebcoon',
        password: 'challis'
      })

      let user = await db('users')
        .where({ id })
        .first();

      // assert the record was inserted
      expect(user.username).toBe('ebcoon')
    })
  })
});

describe('POST /login', () => {
  it('responds with json', () => {
    request(server)
      .post('/login')
      .auth('ebcoon', 'challis')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('responds with a 401', () => {
    request(server)
      .post('/login')
      .auth('tjvonbr', 'challis')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
  })
})

describe('POST /register', () => {
  it ('responds with a 201', () => {
    request(server)
      .post('/register')
      .send('username=psmith')
      .set('Accept', 'application/json')
      .expect(201, {
        username: 'psmith'
      })
  })
})