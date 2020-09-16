const express = require('express');

const proxy = require('./proxy');
const script = require('./script');
const cart = require('./cart');
const webhook = require('./webhook');
const register = require('./register');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/proxy', proxy);
router.use('/script', script);
router.use('/cart', cart);
router.use('/webhook', webhook);
router.use('/register', register);

module.exports = router;
