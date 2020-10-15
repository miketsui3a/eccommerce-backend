const mongoose = require("mongoose");
const { Cart, Store, CartToCustomer, Customer } = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')

async function remind_cart() {
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb
    // const cart = await Cart.find()
    // console.log(cart)

    let store = await Store.find({ abandon_cart_remind: true }).populate("cart_instance")
    const cart_list = store.map(x => {
        return {
            carts: x.carts,
            schedule: x.abandon_cart_remind_schedule
        }
    })

    for (let i = 0; i < store.length; i++) {
        for (let j = 0; j < store[i].cart_instance.length; j++) {
            if(store[i].cart_instanc[j].remind_counter<store[i].abandon_cart_remind_schedule.length){
                const time_difference = moment() - moment(store[i].cart_instanc[j].last_remind)
                if(!store[i].cart_instanc[j].last_remind||time_difference>store[i].abandon_cart_remind_schedule[store[i].cart_instanc[j].remind_counter]*60*60*1000){
                    
                    const customerToCart = await CartToCustomer.findOne({cart_token:store[i].cart_instanc[j].cart_token})
                    const cusomter = await Customer.findOne({customer_id: customerToCart.customer_id})
                    //do a whatsapp notice!!!
                    
                    
                    const cart = await Cart.findOneAndUpdate({cart_token:store[i].cart_instanc[j].cart_token},{
                        last_remind: moment(),
                        remind_counter: store[i].cart_instanc[j].remind_counter+1
                    })

                    if(cart.remind_counter===store[i].abandon_cart_remind_schedule.length){
                        cart.reminded = true
                        await cart.save()
                    }

                }
            }
        }
    }


    // let carts = await Cart.find({ reminded: false, cart_token: { $in: cart_list }, last_update_date: { $lt: Date.now() - 86400 * 1000 } })
    // carts = carts.map(x => x.cart_token)
    // const customerToCart = await CartToCustomer.find({ cart_token: { $in: carts } })
    // const customers = await Customer.find({ customer_id: { $in: customerToCart.map(x => x.customer_id) } })


    // do something to notice the customers
    console.log(customers)

    // await Cart.updateMany({ cart_token: { $in: cart_list } }, { reminded: true })



    console.log(moment().format())
    parentPort.postMessage("done")
}

remind_cart()