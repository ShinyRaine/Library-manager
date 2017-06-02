const crypto = require('crypto')
const User = require('../module/user')
const tokenCollector = require('./token.collector')
const OutUser = require('../module/outUser')

let userCollector = {}
function pushUserOut (outUser) {
	return new Promise((resolve, reject) => {
		OutUser.findOne({name: outUser.name}).then(user => {
			if (user) {
				console.log(user.name + "已经过期");
				resolve()
			} else {
				let _outUser = new OutUser({
					name: outUser.name
				})
				_outUser.save()
				.then(() => {
					resolve()
				})
				.catch((err) => {
					reject(err)
				})
			}
		})
		.catch((err) => {
			reject(err)
		})
	})
}
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
userCollector.init = function () {
	User.find({})
	.then((users) => {
		if (users.length === 0) {
			const md5Hash = crypto.createHash('md5')
			md5Hash.update('admin')
			let password = md5Hash.digest('hex')
			console.log(md5Hash)
			let _user = new User({
				name: 'admin',
				password: password,
				manage: 2
			})
			console.log(_user)
			_user.save()
			.catch(e => {
				console.log(e);
			})
		}
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
	if (decoded.manage > 1) {
		User.findOne({name: req.body.name})
		.then((user) => {
			if (user) {
				user.manage = req.body.manage
				user.save()
				.then(() => {
					pushUserOut(user)
					.then(() => {
						return res.json({code:"success", message: '设置成功'})
					})
					.catch((err) => {
						console.log(err)
						return res.json({code:"error", message: '服务器错误'})
					})
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
				OutUser.remove({name: req.body.userName})
				.then(() => {
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
				.catch(err => {
					console.log(err)
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
	if (decoded.manage > 0) {
		User.findOne({name: req.body.name})
		.then(user => {
			if (user.books.length !== 0) {
				return res.json({code:"error", message: '有借阅的用户不可删除'})
			}
			pushUserOut(user)
			.then(() => {
				user.remove()
				return res.json({code:"success", message: '删除成功'})
			})
			.catch((err) => {
				console.log(err)
				return res.json({code:"error", message: '服务器错误'})
			})
		})
		.catch(err => {
			console.log(err);
			return res.json({code:"error", message: '服务器错误'})
		})
	} else {
		return res.json({code:"error", message: '权限不足'})
	}
}

userCollector.getBorrowed = function (req, res) {
	const token = req.body.token
	const decoded = tokenCollector.decodedToken(token)
	User.findOne({name: decoded.name})
	.then(user => {
		return res.json(user.books)
	})
	.catch((err) => {
		console.log(err)
		return res.json({code:"error", message: '服务器错误'})
	})
}
module.exports = userCollector
