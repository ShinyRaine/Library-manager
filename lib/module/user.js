const mongoose = require( 'mongoose')
const crypto = require('crypto')

const userSchema = require('../schema/user')

const User = mongoose.model('User', userSchema)
let userCollector = {}

userCollector.all = function (req, res) {
	user.fetch(function(err, user){
		if (err) {
			console.log(err)
		}
		res.json(user)
	})
}

// POST /user/signup
userCollector.signup = function (req, res) {
  const user = new User({
    name: req.body.name,
    password: req.body.password
  })
  User.findOne({ name: req.body.name }, (findErr, existingUser) => {
    if (existingUser) {
      return res.json({ message: '用户名已存在' })
    }

    user.save((saveErr) => {
      if (saveErr) {
        console.log(saveErr)
      }
      req.session.loggedIn = user
      res.json({
        message: "success",
        user: {
          name: user.name,
          manage: user.manage
        }
      })
    })
  })
}

userCollector.login = function (req, res, next) {
  User.findOne({ name: req.body.userName }, (err, user) => {
    if (err) {
      return console.log(err)
    }
    if (user) {
      user.comparePassword(req.body.password, function(err, isMatch){
        if (err) {
          console.log(err)
        }
        if (isMatch) {
          req.session.loggedIn = user
          return res.json({
            message: '登录成功',
            user: {
              name: user.name,
              manage: user.manage
            }
          })
        }else {
          return res.json({message: "密码错误"})
        }
      })
    } else {
      return res.json({message:'用户不存在'})
    }
  })
}

userCollector.logout = function (req, res) {
  req.session.loggedIn = null
  res.redirect('/')
}
module.exports = userCollector
