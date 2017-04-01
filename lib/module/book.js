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
const https = require('https')
bookCollector.addbook = function (req, res) {
	let isbn = req.body.isbn
	console.log(isbn)
	https.get({
		host: 'api.douban.com',
	 	path: '/v2/book/isbn/' + isbn}, (rs) => {
			let body = ''
			rs.on('data', (data) => {
				body += data
			})
			rs.on('end', () => {
				let bookObj = JSON.parse(body)
				const _book = new Book({
						isbn: isbn,
						name: bookObj.title,
						author: bookObj.author,
						translator: bookObj.translator,
						pic: bookObj.image,
						type: bookObj.type,   // 以后自己选 req.body.type
						state: 0,
						description: bookObj.summary,
						publishTime: bookObj.pubdate
					})
				_book.save((err,book) => {
					if (err) {
						console.log(err)
					}
					res.json(book)
				})
			})
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
