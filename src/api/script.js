const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.debug('/script📜')
    res.download("src/scripts/script_tag.js");
})

module.exports = router;