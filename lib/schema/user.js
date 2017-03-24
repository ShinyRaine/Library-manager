const mongoose = require('mongoose')
const crypto = require('crypto')

let userSchema = new mongoose.Schema({
  name: String,
  password: String,
  manage: {type: Number, default: 0}, // 权限：普通用户 0 管理员 1
  books: Array
})
module.exports = userSchema

userSchema.statics = {
  all: function(cb) {
    return this.find({}, cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id}, cb)
  }
}
userSchema.methods = {
  comparePassword: function(password, cb) {
    const md5Hash = crypto.createHash('md5')
    md5Hash.update(password)
    p = md5Hash.digest('hex')

    if ( p === this.password ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
}
userSchema.pre('save', function(next) {
  let user = this
  const md5Hash = crypto.createHash('md5')
  md5Hash.update(this.password)
  this.password = md5Hash.digest('hex')
  next()
})
