const express = require('express');
const mongoose = require("mongoose");
const { Store } = require("../model/schema");

const router = express.Router();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // connect mongodb


router.post('/', async (req, res) => {
  const store = await Store.findOneAndUpdate({ store_id: req.body.store_id }, {
    $push: { abandon_cart_remind_schedule: req.body.schedule }
  })

  res.sendStatus(200)
})

router.delete('/', async (req, res) => {
  const store = await Store.findOneAndUpdate({ store_id: req.body.store_id }, {
    abandon_cart_remind_schedule: []
  })

  res.sendStatus(200)
})

module.exports = router