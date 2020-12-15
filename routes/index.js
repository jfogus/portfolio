const express = require('express');
const router = express.Router();
const mysqlPool = require('../config/db.config');

/* GET home page. */
router.get('/', function(req, res, next) {
    let context = { title: 'Home'}

    getBooks()
        .then(books => {
            context.books = books;
            context.page = 'home';

            res.render('index', context);
        })
        .catch((err) => {
            return res.status(400).json({ errors: err });
        });
});

function getBooks() {
    /* Queries the local database for links, authors, and reviews */
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT title, authors.name AS author, img_link, text_link, review FROM books ' +
            'JOIN authors ON books.author_id = authors.author_id ' +
            'ORDER BY book_id DESC;',
            (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            }
        )
    });
}

module.exports = router;
