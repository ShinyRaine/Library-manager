const mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
  isbn: String,
  name: String,
  author: String,
  pic: String,
  type: String,
  state: Number,
  description: String,
  publishTime: Date,
  meta: {
    storageTime: {type: Date, default: Date.now},
    borrowTime: {type: Date, default: Date.now}
  }
})
bookSchema.statics = {
  fetch: function(cb) {
    return this.find({}, cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id}, cb)
  }
}
module.exports = bookSchema
