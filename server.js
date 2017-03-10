const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
// var assert = require('assert');

const path = require('path')
const app = express()

const webpack = require('webpack')

if (process.env.NODE_ENV === 'dev') {
	var webpackDevMiddleware = require('webpack-dev-middleware'),
	    webpackHotMiddleware = require('webpack-hot-middleware'),
	    webpackDevConfig = require('./webpack.config.js')

	var compiler = webpack(webpackDevConfig);

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

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

const Books = require('./lib/module/books')
app.get('/books', function (req, res) {
	Books.fetch(function(err, book){
		if (err) {
			console.log(err)
		}
		res.json(book)
	})
})

const https = require('https')
app.post('/admin/books/new', function(req, res) {
	let isbn = req.body.isbn
	console.log(isbn)
	https.get({
		host: 'api.douban.com',
	 	path: '/v2/book/isbn/' + isbn}, (rs) => {
			let body = ''
			rs.on('data', (data) => {
				body += data
			})
			rs.on('end', () => {
				let data = JSON.parse(body)
				res.send(data)
			})
	})
	// var bookObj = req.body
	// var _book = new Books({
	// 		isbn: bookObj.isbn,
	// 		name: bookObj.name,
	// 		author: bookObj.author,
	// 		pic: bookObj.pic,
	// 		type: bookObj.type,
	// 		state: bookObj.state,
	// 		description: bookObj.description,
	// 		publishTime: bookObj.publishTime
	// 	})
	// 	_book.save(function(err,book) {
	// 		if (err) {
	// 			console.log(err)
	// 		}
	// 		res.send('ok')
	// 	})
})

app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.accepts('html') || req.path.endsWith('.js') || req.path.endsWith('.css')) {
	 return next()
  }
	res.sendFile(req.baseUrl + '/index.html')
})

app.listen(3000,function () {
	console.log('listening on *:3000')
})
