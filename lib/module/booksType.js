const mongoose = require( 'mongoose')
const bookTypeSchema = require('../schema/bookType')
const tokenCollector = require('./tokenCollector')

const Type = mongoose.model('Type', bookTypeSchema)
let typeCollector = {}
const bookCollector = require('./book')
typeCollector.all = function (req, res) {
	Type.find({})
	.then((type) => {
		res.json(type)
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}

typeCollector.add = (req, res) => {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		Type.findOne({name: req.body.name, father: req.body.father})
		.then((type) => {
			if (type) {
				res.json({code:"error", message: '该条目已存在'})
			} else {
				const _type = new Type({
          name: req.body.name,
          books: [],
          son: [],
          father: req.body.father || ''
				})
				_type.save()
				.then(() => {
					if (req.body.father) {
						Type.findOne({name: req.body.father, father: ''})
						.then((type) => {
							type.son.push(req.body.name)
							type.save()
							.then(() => {
								return res.json({code: "success", message: "添加成功"})
							})
						})
					}
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
typeCollector.remove = (req, res) => {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		Type.findOne({name: req.body.name, father: req.body.father})
		.then((type) => {
			console.log(type);
			if (type.books.length) {
				type.books.map((isbn) => {
					console.log(isbn)
					bookCollector.editBook(isbn, {
						type: ''
					})
					.catch((err) => {
						console.log(err)
					})
				})
			}
			console.log(type.son);
			if (type.son.length) {
				console.log(type.son);
				type.son.map((item) => {
					Type.remove({name: item,father:type.name})
					.catch(err => {
						console.log(err);
					})
				})
			}
			Type.findOne({name: type.father, father: ''})
			.then((father) => {
				console.log('here');
				console.log(father);
				if (father) {
					father.son.splice(type.son.indexOf(type.name), 1)
					father.save()
					.catch((err) => {
						console.log(err)
						return res.json({code:"error", message: '服务器错误'})
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
			.then(() => {
				console.log(11111111);
				Type.remove({name: req.body.name, father: req.body.father})
				.then(() => {
						return res.json({code:"success",message: '删除成功'})
				})
				.catch((err) => {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				})
			})
		})
		.catch(err => {
			console.log(err);
		})
	} else {
		return res.json({code:"error",message: '权限不足'})
	}
}
typeCollector.addBookToType = (type, book) => {
	let name = '', father = ''
	if (type.length === 1) {
		name = type[0]
	}
	if (type.length === 2) {
		father = type[0]
		name = type[1]
	}
	Type.findOne({father: father, name: name})
	.then((typeObj) => {
		if (typeObj) {
			if (!typeObj.books.includes(book)) {
				typeObj.books.push(book)
				typeObj.save()
				.catch((err) => {
					console.log(err)
				})
			}
		}
	})
	.catch((err) => {
		console.log(err)
	})
}

typeCollector.removeBookFormType = (type, book) => {
	let name = '', father = ''
	if (type.length === 1) {
		name = type[0]
	}
	if (type.length === 2) {
		father = type[0]
		name = type[1]
	}
	Type.findOne({father: father, name: name})
	.then((typeObj) => {
		if (typeObj) {
			let num = typeObj.books.indexOf(book)
			if (num !== -1) {
				typeObj.books.splice(num, 1)
				typeObj.save()
				.catch((err) => {
					console.log(err)
				})
			}
		}
	})
	.catch((err) => {
		console.log(err)
	})
}

module.exports = typeCollector
