const mongoose = require( 'mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const userSchema = require('../schema/user')
const User = mongoose.model('User', userSchema)
let userCollector = {}
const key = 'test'

function getToken (user) {
	const u = {
		name: user.name,
		manage: user.manage || 0
	}
	return jwt.sign(user, key, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}
userCollector.all = function (req, res) {
	User.all(function(err, user){
		if (err) {
			console.log(err)
		}
		res.json(user)
	})
}

userCollector.checkManage = function (req, res) {
	const token = req.body.token
	if (token) {
		try {
			const decoded = jwt.verify(token, key)
			console.log(decoded);
			return res.json({ manage: decoded.manage })
		} catch (e) {
			console.log(e)
			res.send(e)
		}
	} else {
		return res.json({ message: "请登录" })
	}
}
userCollector.setManage = function (req, res) {
	const token = req.body.token
	if (token) {
		try {
			const decoded = jwt.verify(token, key)
			if (decoded.manage > req.body.manage) {
				User.findOne({name: req.body.name}, (err, user) => {
					if (err) {
						console.log(err)
					}
					if (user) {
						user.manage = req.body.manage
						user.save((err) => {
							if (err) {
								console.log(err)
								res.json({message: '服务器错误'})
							}
							res.json({message: "修改成功"})
						})
					} else {
						res.json({message: '未找到用户'})
					}
				})
			} else {
				res.json({message: "权限不足，请联系管理员修改权限"})
			}
		} catch (e) {
			console.log(e)
			res.json({message: '服务器错误'})
		}
	}
}


// POST /user/signup
userCollector.signup = function (req, res) {
  let user = new User({
    name: req.body.name,
    password: req.body.password
  })
	const tokenData = {
		name: user.name,
		manage: user.manage || 2
	}
  User.findOne({ name: req.body.name }, (findErr, existingUser) => {
    if (existingUser) {
      return res.json({ message: '用户名已存在' })
    }
    user.save((saveErr) => {
      if (saveErr) {
        console.log(saveErr)
      }
      // req.session.loggedIn = user
      res.json({
        message: "success",
        name: user.name,
				token: getToken(tokenData)
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
          // req.session.loggedIn = user
					const tokenData = {
						name: user.name,
						manage: user.manage
					}
          return res.json({
            message: 'success',
            name: user.name,
						token: getToken(tokenData)
          })
        } else {
          return res.json({message: "密码错误"})
        }
      })
    } else {
      return res.json({message:'用户不存在'})
    }
  })
}
userCollector.remove = function (req, res) {
	const token = req.body.token
	if (token) {
		const decoded = jwt.verify(token, key)
		if (decoded.manage) {
			User.remove({name: req.body.name}, err => {
				if (err) {
					console.log(err)
				}
				res.json({message: '删除成功'})
			})
		} else {
			res.json({message: '权限不足'})
		}
	}

}
module.exports = userCollector
