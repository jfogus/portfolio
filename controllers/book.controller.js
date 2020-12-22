const bookModel = require('../models/book.model');

module.exports.findAll = (req, res) => {
    bookModel.fetchAll((err, data) => {
        if (err) {
            return res.status(500).json({ err: err });
        }

        const context = {
            title: 'Home',
            books: data
        }

        return res.status(200).render('index', context);
    });
};