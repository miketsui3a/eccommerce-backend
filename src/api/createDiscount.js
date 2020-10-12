const express = require('express')
const mongoose = require("mongoose");
const { Store } = require('../model/schema')
const fetch = require('node-fetch');
const moment = require('moment')



const router = express.Router()

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); // connect mongodb


router.post('/', async (req, res) => {
    console.log('/create-discount')
    const store = await Store.findOne({ store_name: req.body.store_name })
    if (store) {
        const priceRule = await fetch(`https://${req.body.store_name}/admin/api/2020-07/price_rules.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": store.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "price_rule": {
                    "title": req.body.title,
                    "target_type": req.body.target_type || 'line_item', //line_item : shipping_line
                    "target_selection": req.body.target_selection||'all', //all : entitled
                    "allocation_method": req.body.allocation_method||'across', //each : across
                    "value_type": req.body.value_type, //fixed_amount : percentage
                    "value": req.body.value, // e.g. -5.0
                    "customer_selection": req.body.customer_selection || 'all', //all : prerequisite
                    "starts_at": moment().format()
                }
            })
        }).then(r=>r.json())

        console.log(priceRule)

        const discountCode = await fetch(`https://${req.body.store_name}/admin/api/2020-07/price_rules/${priceRule.price_rule.id}/discount_codes.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": store.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "discount_code": {
                    "code": req.body.discountCode
                }
            })
        })

        console.log(discountCode)

    }

    res.send("OK")
})

module.exports = router