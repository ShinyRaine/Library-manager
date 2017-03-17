const mongoose = require( 'mongoose')
const userSchema = require('../schema/user')

const User = mongoose.model('User', userSchema)
let userCollector = {}

// POST /user/signup
userCollector.signUp = function (req, res, next) {
  const user = new User({
    name: req.body.name,
    password: req.body.password
  });

  User.findOne({ email: req.body.name }, (findErr, existingUser) => {
    if (existingUser) {
      return res.json({ message: '用户名已存在' });
    }

    return user.save((saveErr) => {
      if (saveErr) {
        console.log(saveErr)
      }
      res.json({ message: "注册成功" })
    });
  });
}

userCollector.login = function (req, res, next) {
    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(401).json({ message: loginErr });
      return res.status(200).json({
        message: 'You have been successfully logged in.'
      });
    });
  })(req, res, next);
}

// export function logout(req, res) {
//   req.logout();
//   res.redirect('/');
// }
module.exports = userCollector
