const express = require('express');
const router = express.Router();
const mysqlPool = require('../settings/dbconf');

router.get('/', (req, res, next) => {
    let context = {
        title: 'Contact'
    }

    res.render('contact', context);
});

// TODO: Have a script run daily to send new emails to myself.

router.post('/', (req, res, next) => {
    mysqlPool.query(
        "INSERT INTO messages (`type`, `email`, `message`) VALUES (?, ?, ?)",
        [req.body.type, req.body.email, req.body.message],
        (err, result) => {
            if (err) {
                // Handle the error
                next(err);
                return;
            }

            // Send the response
            return res.status(200).json({ message: 'Success' });
        }
    )
});

module.exports = router;