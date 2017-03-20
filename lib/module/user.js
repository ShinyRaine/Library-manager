const mongoose = require( 'mongoose')
const userSchema = require('../schema/user')

const User = mongoose.model('User', userSchema)
let userCollector = {}

// POST /user/signup
userCollector.signup = function (req, res) {
  const user = new User({
    name: req.body.name,
    password: req.body.password
  })
  console.log(user)
  User.findOne({ name: req.body.name }, (findErr, existingUser) => {
    if (existingUser) {
      return res.json({ message: '用户名已存在' })
    }

    user.save((saveErr) => {
      if (saveErr) {
        console.log(saveErr)
      }
      req.session.loggedUser = user.name
      res.json({
        message: "注册成功",
        name: user.name,
        manage: user.manage        
      })
    })
  })
}

userCollector.login = function (req, res, next) {
  User.findOne({ name: req.body.name }, (findErr, user) => {
    if (findErr) {
      return res.json({ message: "用户不存在" })
    }
    let password = req.body.password
    if ( password === user.password ) {
      req.session.loggedUser = user.name
      res.json({
        message: '登录成功',
        name: user.name,
        manage: user.manage
      })
    }
  })
}

userCollector.logout = function (req, res) {
  req.session.loggedIn = null
  res.redirect('/')
}
module.exports = userCollector
