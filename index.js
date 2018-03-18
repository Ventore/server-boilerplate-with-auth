const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost/auth');

app.use(logger('common'));
app.use(
  bodyParser.json({
    type: 'application/json',
  })
);

app.use('/', indexRouter);

const IP = process.env.IP || '127.0.0.1';
const PORT = process.env.PORT || 8080;

http.createServer(app).listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}/`);
});
