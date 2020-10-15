const express = require('express');
const mongoose = require("mongoose");
const { response } = require('express');
const { Cart, CartToCustomer, Store, Customer } = require("../model/schema");

const router = express.Router();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // connect mongodb

router.post('/orderpayment', async (req, res) => {
  console.debug('/orderpayment💰')
  const deleted = await CartToCustomer.findOneAndDelete({ customer_id: req.body.customer.id })
  let store = await Store.findOne({ carts: deleted.cart_token })
  store.carts.splice(store.carts.indexOf(deleted.cart_token), 1)
  console.log(store)
  store.save()
  res.sendStatus(200)
});

router.post('/cart-creation', async (req, res) => {
  console.debug("/cart-creation")
  console.debug(req.body.token)

  let exist = await Cart.exists({ cart_token: req.body.token })

  if (!exist) {
    const cart = new Cart({
      cart_token: req.body.token,
      ecommerce: 'shopify',
      items: req.body.line_items,
    })

    await cart.save()

  } else {
    await Cart.findOneAndUpdate({ cart_token: req.body.token }, {
      items: req.body.line_items,
      last_update_date: Date.now(),
      reminded: false
    })
  }

  res.sendStatus(200)
})

router.post('/cart-update', async (req, res) => {
  console.debug("/cart-updata")

  let exist = await Cart.exists({ cart_token: req.body.token })

  if (!exist) {
    const cart = new Cart({
      cart_token: req.body.token,
      ecommerce: 'shopify',
      items: req.body.line_items,
    })
    await cart.save()
  } else {
    await Cart.findOneAndUpdate({ cart_token: req.body.token }, {
      items: req.body.line_items,
      last_update_date: Date.now(),
      reminded: false,
      remind_counter: 0
    })
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

router.post('/theme-publish', async (req, res) => {
  console.debug("/theme-publish")
  console.log(req)
  res.sendStatus(200)
})

router.post('/customer-create', async (req, res) => {

  const exist = await Customer.exists({ customer_id: req.body.id, })

  if (!exist) {

    const customer = new Customer({
      customer_id: req.body.id,
      customer_name: `${req.body.first_name} ${req.body.last_name}`,
      customer_email: req.body.email,
      customer_phone: req.body.note.split(' ')[1],
      ecommerce: 'shopify'
    })

    await customer.save()


  }
  res.sendStatus(200)
})

module.exports = router;