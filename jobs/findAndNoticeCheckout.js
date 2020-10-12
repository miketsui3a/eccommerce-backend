const mongoose = require("mongoose");
const { Store, NoticedCheckout } = require('../src/model/schema')
const moment = require('moment')
const { parentPort } = require('worker_threads')

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

        checkouts.forEach(async checkout=>{
            let alreadyNoticed = await NoticedCheckout.exists({checkout_id: checkout.id})
            if((moment(checkout.updated_at)<Date.now()-86400000) && !checkout.closed_at && !alreadyNoticed){
                //notice!
                const noticedCheckout = new NoticedCheckout({
                    checkout_id: checkout.id
                })
                noticedCheckout.save()
            }
            if((moment(checkout.updated_at)>=Date.now()-86400000) && !checkout.closed_at){
                NoticedCheckout.findOneAndDelete({checkout_id: checkout.id})
            }
        })
    })
}