const mongoose = require("mongoose");
const { Cart, Store, CartToCustomer, Customer } = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')

async function remind_cart() {
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    let store = await Store.find({ abandon_cart_remind: true }).populate("cart_instance")

    console.log(store)

    for (let i = 0; i < store.length; i++) {
        for (let j = 0; j < store[i].cart_instance.length; j++) {
            console.log(store[i].cart_instance[j].remind_counter, store[i].abandon_cart_remind_schedule.length)
            if(store[i].cart_instance[j].remind_counter<store[i].abandon_cart_remind_schedule.length){
                const time_difference = moment() - moment(store[i].cart_instance[j].last_remind)
                console.log('timed',time_difference)
                if(!store[i].cart_instance[j].last_remind||time_difference>store[i].abandon_cart_remind_schedule[store[i].cart_instance[j].remind_counter]*60*60*1000){
                    
                    const customerToCart = await CartToCustomer.findOne({cart_token:store[i].cart_instance[j].cart_token})
                    const customer = await Customer.findOne({customer_id: customerToCart.customer_id})
                    //TODO: implement the notice function here

                    console.log('remind ',customer)
                    
                    
                    const cart = await Cart.findOneAndUpdate({cart_token:store[i].cart_instance[j].cart_token},{
                        last_remind: moment(),
                        remind_counter: store[i].cart_instance[j].remind_counter+1
                    })

                    if(cart.remind_counter===store[i].abandon_cart_remind_schedule.length){
                        cart.reminded = true
                        await cart.save()
                    }

                }
            }
        }
    }

    console.log(moment().format())
    parentPort.postMessage("done")
}

remind_cart()