# Library-manager
本项目正在开发初期，大部分工作未完成，会有很多BUG和需要改进的设计。

## 路由规则

注册
注册页：GET /signup
注册（包含上传头像）：POST /signup

登录
登录页: GET /login
登录: POST /login
登出: POST /logout

管理
管理页面:  GET /admain
添加图书: POST /admain/addbook
修改图书: POST /admain/:bookId/edit
删除图书: POST /admain/:bookId/remove

添加分类: POST /admain/addtype
删除分类：POST /admain/:typeBame/remove

首页
查询书: GET /books
所有分类: GET /types
借阅: POST /books/:bookId/borrow
预定: POST /books/:bookId/reserve

个人中心
个人中心页: GET/user
归还: POST /books/:bookId/return

借阅查询: GET /user/borrow
预定查询: GET /user/reserve
