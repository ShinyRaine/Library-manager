const Book = require('../module/book')
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
						num: bookObj.num,
						description: bookObj.description,
						publishTime: bookObj.publishTime
					})
				_book.save()
				.then((book) => {
					return res.json({code: "success", message: "添加成功"})
				})
				.then(TypeCollector.addbook.bind(null, bookObj.type, bookObj.isbn))
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

module.exports = bookCollector