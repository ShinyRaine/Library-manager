const mongoose = require('mongoose')
const Book = require('../module/book')

let bookTypeSchema = new mongoose.Schema({
  name: String,
  books: {type: Array, default: []},
  son: {type: Array, default: []},
  father: {type: String, default: ''}
})

bookTypeSchema.post('remove', (doc, next) => {
  if(doc.books.length) {
    doc.books.map(isbn => {
      Book.findOne({isbn: isbn})
      .then(book => {
        book.update({type: []})
        .then(() => {
          next()
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      })
    })
  } else {
    next()
  }
})

module.exports = bookTypeSchema
