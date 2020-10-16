const mongoose = require("mongoose");
const { Store, NoticedCheckout } = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')
const fetch = require('node-fetch')

async function remind_checkout(){
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    let store = await Store.find({ abandon_checkout_remind: true })

    store.forEach(async s=>{
        const checkouts = await fetch(`https://${s.store_name}/admin/api/2020-07/checkouts.json`,{
            headers: {
                "X-Shopify-Access-Token": s.token,
                "Content-Type": "application/json"
            },
            method: "GET",
        }).then(r=>r.json())

        console.log('cccc',checkouts)

        checkouts.checkouts.forEach(async checkout=>{
            console.log(checkout)

            if(checkout.closed_at!=null){
                return
            }

            const alreadyNoticed = await NoticedCheckout.exists({checkout_id: checkout.id})
            let noticedCheckout = await NoticedCheckout.findOne({checkout_id: checkout.id})

            if(!alreadyNoticed){
                if(s.abandon_checkout_remind_schedule.length!=0){
                    if(moment()-moment(checkout.updated_at)>s.abandon_checkout_remind_schedule[0]*60*60*1000){
                        //TODO: implement the notice function here

                        const noticedCheckout = new NoticedCheckout({
                            checkout_id: checkout.id
                        })
                        noticedCheckout.save()
                    }
                }
            }else{
                if(noticedCheckout.remind_counter<s.abandon_checkout_remind_schedule.length){

                    if(moment()-moment(noticedCheckout.noticed_date)>s.abandon_checkout_remind_schedule[noticedCheckout.remind_counter]*60*60*1000){

                        //TODO: implement the notice function here
    
                        noticedCheckout.remind_counter = noticedCheckout.remind_counter+1
                        noticedCheckout.noticed_date = Date.now()
                        noticedCheckout.save()
                    }

                }
            }
        })
    })
}

remind_checkout()