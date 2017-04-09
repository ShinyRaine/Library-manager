const mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  pic: String,
  type: {type: String, default: '未分类'}, //图书分类
  state: Number, // 图书状态state，未借是0，借出1
  description: String,
  publishTime: String,
  meta: {
    storageTime: {type: Date, default: Date.now},
    borrowUser: String,
    borrowTime: Date
  }
})
module.exports = bookSchema
