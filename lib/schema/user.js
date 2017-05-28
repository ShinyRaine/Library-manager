const mongoose = require('mongoose')
const crypto = require('crypto')
let book = new mongoose.Schema({
  isbn: String,
  title: String,
  type: Array,
  borrowTime: Date
})
let userSchema = new mongoose.Schema({
  name: String,
  password: String,
  manage: {type: Number, default: 0}, // 权限：普通用户 0 管理员 1
  books: [book]
})
module.exports = userSchema

userSchema.methods.comparePassword = function(password) {
    const md5Hash = crypto.createHash('md5')
    const user = this
    md5Hash.update(password)
    p = md5Hash.digest('hex')

    return new Promise((resolve, reject) => {
      if ( p === user.password ) {
        return resolve(true)
      } else {
        return reject(false)
      }
    })
}

userSchema.methods.isManager = function() {
    const user = this
    return new Promise((resolve, reject) => {
      if ( user.manage > 1 ) {
        return resolve(true)
      } else {
        return reject(false)
      }
    })
}
