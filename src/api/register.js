const express = require('express')
const mongoose = require("mongoose");
const { Store } = require('../model/schema')

/**
 * When the store install the app in the shopify market place,
 * the store will be recoroded in the database with its access_token,
 * shop id and shop name.
 */

const router = express.Router()

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); // connect mongodb

router.post('/', async (req, res) => {
    const exist = await Store.exists({ store_id: req.body.shop_id })

    if (exist) {
        await Store.updateOne({ store_id: req.body.shop_id }, { token: req.body.token, store_name: req.body.shop, })
    } else {
        const store = new Store({
            store_id: req.body.shop_id,
            store_name: req.body.shop,
            token: req.body.token
        })
        await store.save()
    }

    res.send("OK")
})


module.exports = router