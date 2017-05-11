const mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  pic: String,
  type: {type: Array, default: ''}, //图书分类
  num: Number,
  description: String,
  publishTime: String,
  storageTime: {type: Date, default: Date.now},
  meta: Array
  // {
  //   borrowUser: Array,
  //   borrowTime: Date,
  //   borrowNum: Number
  // }
})
module.exports = bookSchema
