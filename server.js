const express = require('express')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
// var assert = require('assert');

const http = require('http')
const path = require('path')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

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


const Books = require('./lib/module/books')
app.get('/books', function (req, res) {
	Books.fetch(function(err, book){
		if (err) {
			console.log(err)
		}
		console.log(book)
		res.json(book)
	})
})
app.post('/admin/books/new', function(res, req) {
	console.log(req.body)
	var isbn = req.body.isbn
	var bookObj = req.body
	var _book
	if (Books.findById(isbn)) {
		res.send('该条目已经存在')
	} else {
		_book = new Books({
			isbn: bookObj.isbn,
			name: bookObj.name,
			author: bookObj.author,
			pic: bookObj.pic,
			type: bookObj.type,
			state: bookObj.state,
			description: bookObj.description,
			publishTime: bookObj.publishTime
		})
		_book.save(function(err,book) {
			if (err) {
				console.log(err)
			}
			res.send('ok')
		})
	}

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
