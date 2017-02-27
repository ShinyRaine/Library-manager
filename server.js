var express = require('express')
// var bodyParser = require('body-parser')

// var mongodb = require('mongodb')
// var MongoClient = require('mongodb').MongoClient
// var assert = require('assert');
var http = require('http')
var app = express()

var webpack = require('webpack')

// if (process.env.NODE_ENV === 'dev') {
	var webpackDevMiddleware = require('webpack-dev-middleware'),
	    webpackHotMiddleware = require('webpack-hot-middleware'),
	    webpackDevConfig = require('./webpack.config.dev.js')

	var compiler = webpack(webpackDevConfig);

	// attach to the compiler & the server
	app.use(webpackDevMiddleware(compiler, {
	    // public path should be the same with webpack config
	    publicPath: webpackDevConfig.output.publicPath,
	    noInfo: false,
			quiet: true
	}))
	app.use(webpackHotMiddleware(compiler))
// }
var server = http.createServer(app);

server.listen(3000,function () {
	console.log('listening on *:3000')
})
// var url = 'mongodb://localhost:27017/test';
// MongoClient.connect(url, function(err, db) {
// 	app.users = db.collection("users");
// 	assert.equal(null, err);
// 	console.log("Connected correctly to server");
// 	app.listen(3000,function () {
// 		console.log('listening on *:3000')
// 	})
// });
// app.use(bodyParser.urlencoded({ extended: false }))
//
// app.use(express.static('static'))
// app.get('/', function(req, res) {
// 	res.send('cxy')
// })
// app.post('/signup', function(req, res, next) {
// 	var data = req.body
// 	app.users.insert({'name': data.name, 'password': data.password}, function(err, doc) {
// 		if (err) {
// 			return next(err)
// 		}
// 		res.redirect('/login/' + doc.ops[0].name)
// 	})
// })
// app.post('/signin', function(req, res, next) {
// 	var data = req.body
// 	app.users.findOne({'name': data.name}, function(err, user) {
// 		if (err) {
// 			return next(err)
// 		}
// 		if (data.password == data.password) {
// 			res.redirect('/login/' + user.name)
// 		}else {
// 			res.send('用户名密码不匹配')
// 		}
//
// 	})
// })
// app.get('/login/:username', function(req, res) {
// 	res.send(req.params.username)
// })
