const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Bree = require('bree')

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

const bree = new Bree({ // schdule for checking the abandon cart and checkout. To enable the checking of abandon cart, uncomment the line bree.start()
  jobs: [
    {
      name: 'findAndNotice',
      interval: '30s'
    }
  ]
})

// bree.start()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
