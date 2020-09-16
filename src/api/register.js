const express = require('express')
const mongoose = require("mongoose");
const { Store } = require('../model/schema')


const router = express.Router()

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // connect mongodb

router.post('/',(req, res)=>{
    const store = new Store({
        store_name: req.body.shop,
        token: req.body.token
    })
    store.save()
})


module.exports = router