const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/', async (req, res) => {
  console.debug('/proxy💻', req.body)
  let header = {
    "X-Shopify-Access-Token": req.body.accessToken,
    "Content-Type": "application/json",
  };
  const rst = await fetch(`https://${req.body.shop}/admin/api/2020-07/checkouts.json`, {
    headers: header,
    method: 'GET',
  }).then(r => r.json())
  console.log(rst)
  res.send(rst)
});

module.exports = router;
