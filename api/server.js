const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const dbConnection = require('../database/dbConfig.js');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

const sessionConfig = {
  name: 'sprint',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tableName: 'knexsessions',
    sidfieldname: 'sessionid',
    createTable: true,
    clearInterval: 1000 * 60 * 30
  })
};

server.use(session(sessionConfig));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
