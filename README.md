# Library-manager
本项目正在开发初期，大部分工作未完成，会有很多BUG和需要改进的设计。

## 路由规则

### 注册
注册页：GET /user/signup

注册：POST /signup  TODO: 上传头像

### 登录
登录页: GET /login

登录: POST /user/login

### 管理
管理页面:  GET /admain

添加图书: POST /admin/books/new

修改图书: POST /admin/books/edit

删除图书: POST /admin/books/remove

添加分类: POST /admain/type/new

删除分类：POST /admain/type/remove

删除用户: /user/remove

检查用户权限: /user/checkmanage

设置管理员: /user/setmanage

检查登录: /user/checklogin

### 首页
查询书: GET /books

所有分类: GET /types

借阅: POST /books/borrow

归还: POST /books/return

TODO :预定: POST /books/reserve

### 个人中心
个人中心页: GET/user

归还: POST /books/return

借阅查询: GET /user/borrowed

预定查询: GET /user/reserved
