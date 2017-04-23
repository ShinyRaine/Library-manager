const mongoose = require( 'mongoose')
const bookTypeSchema = require('../schema/bookType')
const tokenCollector = require('./tokenCollector')

const Type = mongoose.model('Books', bookTypeSchema)
let TypeCollector = {}

TypeCollector.all = function (req, res) {
	User.Type({})
	.then((type) => {
		res.json(type)
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}

TypeCollector.add = (req, res) => {
	const type = req.body.type
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		Type.findOne({key: type.key})
		.then((type) => {
			if (type) {
				res.json({code:"error", message: '该条目已存在'})
			} else {
				const _type = new Book({
          key: type.key,
          name: type.name,
          books: [],
          son: [],
          father: type.father
				})
				_type.save()
				.then(() => {
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

TypeCollector.addbook = (type, book) => {
	const typeKey = type.pop()
	Type.findOne({key: type})
	.then((typeObj) => {
		if (typeObj) {
			if (!typeObj.books.includes(book)) {
				typeObj.books.push(book)
				typeObj.save()
				.then(() => true)
			}
		}
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}
TypeCollector.removebook = (type, book) => {
	const typeKey = type.pop()
	Type.findOne({key: type})
	.then((typeObj) => {
		if (typeObj) {
			let num = typeObj.books.indexOf(book)
			if (num !== -1) {
				typeObj.books.splice(num, 1)
				typeObj.save()
				.then(() => true)
			}
		}
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}

module.exports = TypeCollector
