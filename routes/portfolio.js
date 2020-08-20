const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    let context = {
        title: 'Portfolio'
    }

    res.render('portfolio', context);
});

module.exports = router;