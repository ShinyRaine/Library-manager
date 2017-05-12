const mongoose = require('mongoose')

let mesg = new mongoose.Schema({
  borrowUser: String,
  borrowTime: Date
})
let bookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  pic: String,
  type: {type: Array, default: ''}, //图书分类
  sumNum: {type: Number, default: 1},
  borrowNum: {type: Number, default: 0},
  description: String,
  publishTime: String,
  storageTime: {type: Date, default: Date.now},
  meta: [mesg]
})
module.exports = bookSchema
