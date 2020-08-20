const express = require('express');
const router = express.Router();
const request = require('request');
const mysqlPool = require('../settings/dbconf');

/* GET home page. */
// TODO: Have page load without books and load dynamically
router.get('/', function(req, res, next) {
    let context = { title: 'Home'}

    getIsbns()
        .then(isbns => {
            return getBooks(isbns);
        })
        .then(books => {
            context.books = books;

            res.render('index', context);
        })
        .catch((err) => {
            return res.status(400).json({ errors: err });
        });
});

function getBooks(isbns) {
  /* Queries openlibrary.org with a given array of isbns and returns
     objects containing the details of each book. */
    return new Promise((resolve, reject) => {
        // Construct and add the query string to the url
        let url = 'https://openlibrary.org/api/books?jscmd=data&format=json&bibkeys=';
        isbns = isbns.map(row => ('ISBN:' + row.isbn));
        url += isbns.join(',');

        request(url, {}, (err, response, body) => {
            if (err || response.statusCode >= 400) {
                return reject(err);
            } else {
                let books = JSON.parse(body);

                books = Object.keys(books).map(key => {
                    return {
                        bookTitle: books[key].title,
                        cover: books[key].cover ? books[key].cover.medium : '',
                        author: books[key].authors[0].name,
                        url: books[key].url
                    }
                });

                return resolve(books);
            }
        });
    });
}

function getIsbns() {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT isbn FROM books',
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
