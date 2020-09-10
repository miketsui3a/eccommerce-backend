const express = require('express');

const router = express.Router();

router.post('/orderpayment', async (req, res) => {
  console.debug('/orderpayment💰', req.body)
  res.sendStatus(200)
});

router.post('/cart-creation', async (req,res)=>{
  console.debug("/cart-creation")
  console.debug(req.body.token)
  res.sendStatus(200)
})

router.post('/cart-update', async (req,res)=>{
  console.debug("/cart-updata")
  console.debug(req.body.token)

  res.sendStatus(200)
})

router.post('/checkout-creation', async (req,res)=>{
  console.debug("/checkout-creation")
  console.debug(req.body.cart_token)
  res.sendStatus(200)
})

router.post('/checkout-update', async (req,res)=>{
  console.debug("/checkout-update")
  console.debug(req.body.cart_token)
  res.sendStatus(200)
})

router.post('/checkout-deletion', async (req,res)=>{
  console.debug("/check-deletion")
  res.sendStatus(200)
})

module.exports = router;