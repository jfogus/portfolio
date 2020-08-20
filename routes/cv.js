const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    let context = {
        title: 'CV'
    }

    res.render('cv', context);
});

module.exports = router;