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

if (process.env.NODE_ENV === 'dev') {
	const webpack = require('webpack')
	let webpackDevMiddleware = require('webpack-dev-middleware'),
	    webpackHotMiddleware = require('webpack-hot-middleware'),
	    webpackDevConfig = require('./webpack.config.js')

	let compiler = webpack(webpackDevConfig)
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
		return res.sendFile(__dirname + '/static' + '/index.html')
  }else {
		return next()
	}
	// console.log(req.session.loggedIn)
})

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

const userCollector = require('./lib/collectors/user.collector')
const tokenCollector = require('./lib/collectors/token.collector')
const bookCollector = require('./lib/collectors/book.collector')
const typeCollector = require('./lib/collectors/type.collector')
userCollector.init()
app.use([/\/books\/(borrow|return)/,'/admin/*', /\/user\/(remove|checkmanage|setmanage|borrowed)/], tokenCollector.checklogin)

app.get('/books', bookCollector.all)
app.get('/types', typeCollector.all)

app.get('/user/all', userCollector.all)
app.post('/user/signup', userCollector.signup)
app.post('/user/login', userCollector.login)

app.post('/user/remove', userCollector.remove)
app.post('/user/checkmanage', userCollector.checkManage)
app.post('/user/setmanage', userCollector.setManage)

app.post('/user/borrowed', userCollector.getBorrowed)

app.post('/admin/books/new', bookCollector.addbook)
app.post('/admin/books/remove', bookCollector.remove)
app.post('/admin/books/edit', bookCollector.edit)

app.post('/admin/type/new', typeCollector.add)
app.post('/admin/type/remove', typeCollector.remove)


app.post('/books/search', bookCollector.searchBook)
app.post('/books/borrow', bookCollector.borrowBook)
app.post('/books/return', bookCollector.returnBook)

const https = require('https')
const fs = require('fs')
const privateKey  = fs.readFileSync('./ssl/private.pem', 'utf8')
const certificate = fs.readFileSync('./ssl/file.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

app.listen(3000,function () {
	console.log('listening on *:3000')
})
https.createServer(credentials, app).listen(3001, function() {
  console.log('HTTPS Server is running on: 3001')
})
