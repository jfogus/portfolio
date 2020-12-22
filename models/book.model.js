const mysqlPool = require('../config/db.config');

class Book {
    constructor(title, author, img, link, review) {
        this.title = title;
        this.author = author;
        this.imgUrl = img;
        this.url = link;
        this.review = review;
    }

    static fromReqBody(reqBody) {
        return new Book(
            reqBody.title,
            reqBody.name,
            reqBody.img,
            reqBody.link,
            reqBody.review
        );
    }

    static fromDbDto(bookDbDto) {
        return new Book(
            bookDbDto.title,
            bookDbDto.author,
            bookDbDto.img_link,
            bookDbDto.text_link,
            bookDbDto.review
        );
    }
}

Book.fetchAll = result => {
    const query = 'SELECT title, authors.name AS author, img_link, text_link, review' +
        ' FROM books' +
        ' JOIN authors ON books.author_id=authors.author_id' +
        ' ORDER BY book_id DESC;';

    mysqlPool.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        const bookArray = res.map(bookDbDto => Book.fromDbDto(bookDbDto));
        console.log(bookArray);
        return result(null, bookArray);
    });
}

module.exports = Book;