const Book = require('../module/book')
const User = require('../module/user')
const typeCollector = require('./type.collector')
const tokenCollector = require('./token.collector')

let bookCollector = {}
bookCollector.all = (req, res) => {
	Book.find({})
	.then((book) => {
		return res.json(book)
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}
bookCollector.addbook = (req, res) => {
	const bookObj = req.body
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		Book.findOne({isbn: bookObj.isbn})
		.then((err, book) => {
			if (book) {
				res.json({code:"error", message: '该条目已存在'})
			} else {
				const _book = new Book({
						isbn: bookObj.isbn,
						title: bookObj.title,
						author: bookObj.author,
						translator: bookObj.translator,
						pic: bookObj.pic,
						type: bookObj.type,
						state: 0,
						sumNum: bookObj.sumNum,
						description: bookObj.description,
						publishTime: bookObj.publishTime
					})
				_book.save()
				.then((book) => {
					typeCollector.addBookToType(bookObj.type, book.isbn)
					return res.json({code: "success", message: "添加成功"})
				})
				.catch((err) => {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				})
			}
		})
		.catch((err) => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
		})

	} else {
		return res.json({code:"error", message: '权限不足'})
	}
}
bookCollector.editBook = (isbn, bookObj) => {
	return new Promise((resolve, reject) => {
		Book.findOne({isbn: isbn})
		.then((book) => {
			if (book) {
				if (bookObj.type.length !== 0 && (bookObj.type[0] !== book.type[0] || bookObj.type[1] !== book.type[1])) {
					typeCollector.removeBookFormType(book.type, book.isbn)
					typeCollector.addBookToType(bookObj.type, book.isbn)
				}
				for(let item in book) {
					if ( bookObj[item] && book[item] !== bookObj[item] ){
						book[item] = bookObj[item]
					}
				}
				book.save().then(() => {
					resolve()
				})
				.catch(err => {
					console.log(err);
					reject('服务器错误')
				})
			}else {
				reject("条目不存在")
			}
		})
	})
}
bookCollector.edit = (req, res) => {
	const bookObj = req.body
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		bookCollector.editBook(bookObj.isbn, bookObj)
		.then(() => {
			return res.json({code:"success",message:'修改成功'})
		})
		.catch((err) => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
		})
	} else {
		return res.json({code:"error",message: '权限不足'})
	}
}
bookCollector.remove = (req, res) => {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		Book.remove({isbn: req.body.isbn})
		.then(() => {
			return res.json({code:"success",message: '删除成功'})
		})
		.catch(err => {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
		})
	} else {
		return res.json({code:"error",message: '权限不足'})
	}
}
function findObjInArr (obj) {

}
bookCollector.borrowBook = (req, res) => {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)

	Book.findOne({isbn: req.body.isbn})
	.then((book) => {
		if (book.sumNum - book.borrowNum > 0) {
			book.borrowNum ++
			const time = Date.now()
			book.meta.push({
				borrowUser: decoded.name,
				borrowTime: time
			})
			book.save()
			.then(() => {
				User.findOne({name: decoded.name})
				.then((user) => {
					user.books.push({
						isbn: book.isbn,
						title: book.title,
						type: book.type,
						borrowTime: time
					})
					user.save()
					.then(() => {
						return res.json({code:"success", message: '借出成功'})
					})
				})
				.catch((err) => {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				})
			})
			.catch((err) => {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
			})
		} else {
			return res.json({code:"error",message: '库存不足'})
		}
	})
	.catch(err => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
	})
}
bookCollector.returnBook = (req, res) => {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)

	Book.findOne({isbn: req.body.isbn})
	.then((book) => {
		let borrowUser = book.meta.findIndex((item) => {
			return item.borrowUser === decoded.name && +item.borrowTime === req.body.borrowTime
		})
		if (borrowUser !== -1) {
			book.borrowNum --
			book.meta.splice(borrowUser, 1)
			book.save()
			.then(() => {
				User.findOne({name: decoded.name})
				.then(user => {
					let index = user.books.findIndex((item) => {
						return item.isbn === book.isbn && +item.borrowTime === req.body.borrowTime
					})
					if (index !== -1) {
						user.books.splice(index, 1)
					} else {
						console.log('未找到信息');
						return res.json({code:"error", message: '服务器错误'})
					}
					user.save()
					.then(() => {
						return res.json({code:"success", message: '归还成功'})
					})
					.catch((err) => {
						console.log(err)
						return res.json({code:"error", message: '服务器错误'})
					})
				})
				.catch((err) => {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				})
			})
			.catch((err) => {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
			})
		} else {
			return res.json({code:"error",message: '请使用本人的账号还书'})
		}
	})
	.catch(err => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
	})
}
bookCollector.searchBook = function (req, res) {
	if (req.body.isbn) {
		Book.findOne({isbn: req.body.isbn})
		.then(book => {
			return res.json(book)
		})
		.catch(err => {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
		})
	} else {
		return res.json({code:"error", message: '未知领域'})

	}
}
module.exports = bookCollector
