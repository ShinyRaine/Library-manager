const mongoose = require( 'mongoose')
const bookTypeSchema = require('../schema/bookType')

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

module.exports = TypeCollector
