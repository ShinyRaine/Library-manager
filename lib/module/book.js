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
	const token = req.body.token
	if (token) {
		const decoded = jwt.verify(token, key)
		if (decoded.manage) {
			Book.findOne({isbn: bookObj.isbn}, (err, book) => {
				if (err) {
					console.log(err)
				}
				if (book) {
					res.json({code:"error", message: '该条目已存在'})
				} else {
					const _book = new Book({
							isbn: bookObj.isbn,
							title: bookObj.title,
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
						res.json({code: "success", message: "添加成功"})
					})
				}
			})
		} else {
			res.json({code:"error", message: '权限不足'})
		}
	}

}
bookCollector.edit = function (req, res) {
	const bookObj = req.body
	const token = req.body.token
	if (token) {
		const decoded = jwt.verify(token, key)
		if (decoded.manage) {
			Book.findOne({isbn: bookObj.isbn}, (err, book) => {
				if (err) {
					console.log(err)
				}
				if (book) {
					for(let item in bookObj) {
						if ( item!=='token' && book[item] !== bookObj[item] ){
							book[item] = bookObj[item]
						}
					}
					book.save(err => {
						if (err) {
							console.log(err)
						}
						res.json({code:"success",message:'修改成功'})
					})
				} else {
					res.json({code:"error",message: '条目不存在'})
				}
			})
		} else {
			res.json({code:"error",message: '权限不足'})
		}
	}
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
				res.json({code:"success",message: '删除成功'})
			})
		} else {
			res.json({code:"error",message: '权限不足'})
		}
	}
}

module.exports = bookCollector
