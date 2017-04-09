const express = require('express')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)

// const store = new MongoDBStore(
// 	{
// 		uri: 'mongodb://localhost/testlib',
// 		collection: 'mySessions'
// 	});

const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/testlib')
// var assert = require('assert');

const path = require('path')
const app = express()
// app.use(session({
// 	secret: 'library-manager',
// 	store: store
// }))
const webpack = require('webpack')

if (process.env.NODE_ENV === 'dev') {
	let webpackDevMiddleware = require('webpack-dev-middleware'),
	    webpackHotMiddleware = require('webpack-hot-middleware'),
	    webpackDevConfig = require('./webpack.config.js')

	let compiler = webpack(webpackDevConfig);

	// attach to the compiler & the server
	app.use(webpackDevMiddleware(compiler, {
	    // public path should be the same with webpack config
	    publicPath: webpackDevConfig.output.publicPath,
	    noInfo: false,
			quiet: false,
			stats: {
				colors: true
			}
	}))
	app.use(webpackHotMiddleware(compiler))
}

app.use(express.static(__dirname + '/static'))
// 页面路由重定向
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === "/login" || req.path === "/user" || req.path === "/signup" || req.path === "/admin" ) {
		return res.sendFile(req.baseUrl + '/index.html')
  }else {
		return next()
	}
	// console.log(req.session.loggedIn)
})

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

const userCollector = require('./lib/module/user')
const tokenCollector = require('./lib/module/tokenCollector')
const bookCollector = require('./lib/module/book')

app.get('/user/all', userCollector.all)
app.post('/user/signup', userCollector.signup)
app.post('/user/login', userCollector.login)
app.get('/books', bookCollector.all)

app.use(tokenCollector.checklogin)
app.post('/user/remove', userCollector.remove)
app.post('/user/checkmanage', userCollector.checkManage)
app.post('/user/setmanage', userCollector.setManage)
app.post('/user/checklogin', userCollector.checkManage)

app.post('/admin/books/new', bookCollector.addbook)
app.post('/admin/books/remove', bookCollector.remove)
app.post('/admin/books/edit', bookCollector.edit)



app.listen(3000,function () {
	console.log('listening on *:3000')
})
