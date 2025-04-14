const express = require('express');
const router = express.Router();
const config = require('../config.js');

router.get('/', (req, res) => {
    res.redirect(config.indexRedirect);
});

module.exports = router;