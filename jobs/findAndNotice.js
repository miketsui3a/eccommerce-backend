const mongoose = require("mongoose");
const { Cart, Store } = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')

async function a() {
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb
    // const cart = await Cart.find()
    // console.log(cart)

    const store = await Cart.find({ abandon_cart_remind: true })
    cart_list = store.map(x => x.carts)
    const carts = await Cart.find({ reminded: false, cart_token: { $in: cart_list }, last_update_date: { $lt: Date.now() - 86400 * 1000 } })

    console.log(moment().format())
    parentPort.postMessage("done")
}

a()