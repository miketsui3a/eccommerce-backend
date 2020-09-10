
const { shopifyDao } = require("../model/shopifyDao");
const { shopifyQueryDBDao } = require("../model/shopifyQueryDBDao");

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    console.debug('/cart🛒', req)
    if (req.body.ecommerce === "shopify") {
        shopifyDao(req)
    }
})

router.get('/',async (req ,res)=>{
    console.debug('/cart🛒', req.query)
    if(req.query.ecommerce === 'shopify') {
        const data = await shopifyQueryDBDao(req)
        res.send(data)
    }
})

module.exports = router;