const express = require('express');
const mongoose = require("mongoose");
const { response } = require('express');
const { Cart, CartToCustomer, Store } = require("../model/schema");

const router = express.Router();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // connect mongodb

router.post('/orderpayment', async (req, res) => {
  console.debug('/orderpayment💰')
  const deleted = await CartToCustomer.findOneAndDelete({ customer_id: req.body.customer.id })
  let store = await Store.findOne({  carts: deleted.cart_token })
  store.carts.splice(store.carts.indexOf(deleted.cart_token),1)
  console.log(store)
  store.save()
  res.sendStatus(200)
});

router.post('/cart-creation', async (req, res) => {
  console.debug("/cart-creation")
  console.debug(req.body.token)

  let cart = await Cart.findOne({ cart_token: req.body.token })

  if (cart === null) {
    cart = new Cart({
      cart_token: req.body.token,
      ecommerce: 'shopify',
      items: req.body.line_items,
    })
  } else {
    cart.items = req.body.line_items
    cart.reminded = false
  }

  cart.save()
  res.sendStatus(200)
})

router.post('/cart-update', async (req, res) => {
  console.debug("/cart-updata")

  let cart = await Cart.findOne({ cart_token: req.body.token })
  if (cart === null) {
    cart = new Cart({
      cart_token: req.body.token,
      ecommerce: 'shopify',
      items: req.body.line_items,
    })
    cart.save()
  } else {
    cart.items = req.body.line_items
    cart.last_update_date = Date.now()
    cart.reminded = false
    cart.save()
  }
  res.sendStatus(200)
})

router.post('/checkout-creation', async (req, res) => {
  console.debug("/checkout-creation")
  console.debug(req.body.cart_token)
  res.sendStatus(200)
})

router.post('/checkout-update', async (req, res) => {
  console.debug("/checkout-update")
  console.debug(req.body.cart_token)
  res.sendStatus(200)
})

router.post('/checkout-deletion', async (req, res) => {
  console.debug("/check-deletion")
  res.sendStatus(200)
})

module.exports = router;