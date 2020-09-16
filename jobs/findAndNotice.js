const mongoose = require("mongoose");
const { Cart, Store, CartToCustomer, Customer} = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')

async function remind_cart() {
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb
    // const cart = await Cart.find()
    // console.log(cart)

    let store = await Store.find({ abandon_cart_remind: true })
    const cart_list = store.map(x => x.carts).flat()
    let carts = await Cart.find({ reminded: false, cart_token: { $in: cart_list }, last_update_date: { $lt: Date.now() - 86400 * 1000 } })
    carts = carts.map(x=>x.cart_token)
    const customerToCart = await CartToCustomer.find({cart_token: {$in:carts}})
    const customers = await Customer.find({customer_id:{$in:customerToCart.map(x=>x.customer_id)}})
    

    // do something to notice the customers
    console.log(customers)

    await Cart.updateMany({cart_token:{$in: cart_list}},{reminded:true})



    console.log(moment().format())
    parentPort.postMessage("done")
}

remind_cart()