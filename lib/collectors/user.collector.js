const crypto = require('crypto')
const User = require('../module/user')
const tokenCollector = require('./token.collector')

let userCollector = {}

userCollector.all = function (req, res) {
	User.find({})
	.then((user) => {
		res.json(user)
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}

userCollector.checkManage = function (req, res) {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	return res.send({code:"success", manage: decoded.manage })
}
userCollector.setManage = function (req, res) {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage > req.body.manage) {
		User.findOne({name: req.body.name})
		.then((user) => {
			if (user) {
				user.manage = req.body.manage
				user.save()
				.then(() => {
					return res.json({code:"success", message: "修改成功"})
				})
				.catch((err) => {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				})
			} else {
				return res.json({code:"error", message: '未找到用户'})
			}
		})
		.catch((err) => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
		})
	} else {
		return res.json({code: "error", message: "权限不足，请联系管理员修改权限"})
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
		manage: user.manage || 0
	}
  User.findOne({ name: req.body.name })
	.then((existingUser) => {
    if (existingUser) {
      return res.json({ code:"error", message: '用户名已存在' })
    }

		const md5Hash = crypto.createHash('md5')
		md5Hash.update(user.password)
		user.password = md5Hash.digest('hex')

    user.save()
		.then(() => {
      // req.session.loggedIn = user
      return res.json({
				code:"success",
        message: "注册成功",
        name: user.name,
				token: tokenCollector.getToken(tokenData)
      })
    })
		.catch((err) => {
			console.log(err)
			return res.json({code:"error", message: '服务器错误'})
		})
  })
}

userCollector.login = function (req, res, next) {
  User.findOne({ name: req.body.userName })
	.then((user) => {
    if (user) {
      user.comparePassword(req.body.password)
			.then(() => {
          // req.session.loggedIn = user
				const tokenData = {
					name: user.name,
					manage: user.manage
				}
        return res.json({
					code:"success",
          message: "登录成功",
          name: user.name,
					token: tokenCollector.getToken(tokenData)
        })
      })
			.catch((err) => {
				if (err === false) {
					return res.json({code:"error",message: "密码错误"})
				}else {
					console.log(err)
					return res.json({code:"error", message: '服务器错误'})
				}
			})
    } else {
      return res.json({code:"error",message:'用户不存在'})
    }
  })
}
userCollector.remove = function (req, res) {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	if (decoded.manage) {
		User.remove({name: req.body.name})
		.then(err => {
			if (err) {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
			}
			return res.json({code:"success", message: '删除成功'})
		})
	} else {
		return res.json({code:"error", message: '权限不足'})
	}
}
module.exports = userCollector
