const express = require('express');

const proxy = require('./proxy');
const script = require('./script');
const cart = require('./cart');
const webhook = require('./webhook');
const register = require('./register');
const createDiscount = require('./createDiscount');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/proxy', proxy); // end point for calling shopify admin api.
router.use('/script', script); // provide script tag to the store.
router.use('/cart', cart); // end point for cart activities
router.use('/webhook', webhook); // shopify webhook when cart update etc.
router.use('/register', register); // when the store install the shopify app, this end point will be triggered
router.use('/create-discount', createDiscount); // self explain

module.exports = router;
