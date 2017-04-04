const mongoose = require( 'mongoose')
const bookSchema = require('../schema/book')
const jwt = require('jsonwebtoken')
const key = 'test'

const Book = mongoose.model('Book', bookSchema)

let bookCollector = {}
bookCollector.all = function (req, res) {
	Book.fetch(function(err, book){
		if (err) {
			console.log(err)
		}
		res.json(book)
	})
}
bookCollector.addbook = function (req, res) {
	const bookObj = req.body
	const _book = new Book({
			isbn: bookObj.isbn,
			name: bookObj.title,
			author: bookObj.author,
			translator: bookObj.translator,
			pic: bookObj.pic,
			type: bookObj.type,   // 以后自己选 req.body.type
			state: 0,
			description: bookObj.description,
			publishTime: bookObj.publishTime
		})
	_book.save((err,book) => {
		if (err) {
			console.log(err)
		}
		res.json(book)
	})
}
bookCollector.remove = function (req, res) {
	const token = req.body.token
	if (token) {
		const decoded = jwt.verify(token, key)
		if (decoded.manage) {
			Book.remove({isbn: req.body.isbn}, err => {
				if (err) {
					console.log(err)
				}
				res.json({message: '删除成功'})
			})
		} else {
			res.json({message: '权限不足'})
		}
	}
}

module.exports = bookCollector
