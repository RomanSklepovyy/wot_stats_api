const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const gameProfileRouter = require('./routers/gameProfile');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(gameProfileRouter);

module.exports = app;