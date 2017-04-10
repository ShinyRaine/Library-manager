import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Button, Modal, Table } from 'antd'
const { Header, Content, Sider } = Layout

import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
import BookForm from '../../components/bookForm'
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'book',
      bookFormVisible: false,
      bookFormType: 'addbook',
      bookData: null
    }
  }
  componentWillMount() {
    const { fetchUserData } = this.props.userActions
    const token = localStorage.token
    if (!token) {
      this.showDialog({
        title: '请登录',
        type: 'user',
        cb: browserHistory.push.bind(null, '/login')
      })
    }
  }
  componentDidMount() {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    const token = localStorage.token

    fetchUserData('checkManage', {token: token}).then(() => {
      const { resCode, manage, message } = this.props.state.user
      let routeTo = message.match(/过期/) ? browserHistory.push.bind(null, '/login') : browserHistory.push.bind(null, '/')
      if (resCode === 'error') {
        this.showDialog({
          title: message,
          type: 'user',
          cb: routeTo
        })
      }
    })

    fetchBookData('book')
    fetchUserData('user')
  }
  changeType(type) {
    this.setState({type: type})
  }
  showDialog(options) {
    const { resetUserReq } = this.props.userActions
    const { resetBookReq } = this.props.bookActions
    let reset = options.type === 'user' ? resetUserReq : resetBookReq
    if (options.success === "success") {
      return Modal.success({
        title: options.title,
        onOk: () => {
          options.cb()
          reset()
          return false
        }
      })
    }else {
      return Modal.error({
        title: options.title,
        onOk: () => {
          options.cb()
          reset()
          return false
        }
      })
    }
  }
  setManage(name, num) {
    const { fetchUserData, resetReq } = this.props.userActions
    fetchUserData('setManage', {
      token: localStorage.token,
      name: name,
      manage: num
    }).then(() => {
      const { resCode, message } = this.props.state.user
      this.showDialog({
        success: resCode,
        title: message,
        type: 'user',
        cb: fetchUserData.bind(null, 'user')
      })
    })
  }
  remove(type, id) {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    let fetchData, data, resCode, message
    switch (type) {
      case 'user':
        fetchData = fetchUserData
        data = {token: localStorage.token, name: id}
        break
      case 'book':
        fetchData = fetchBookData
        data = {token: localStorage.token, isbn: id}
        break
    }
    fetchData('remove', data).then(() => {
      this.showDialog({
        success: type === 'user' ? this.props.state.user.resCode : this.props.state.user.message,
        title: type === 'user' ? this.props.state.book.resCode : this.props.state.book.message,
        type: type,
        cb: fetchData.bind(null, type)
      })
    })
  }
  editBook(item) {
    this.setState({
      bookFormVisible: true,
      bookFormType: 'edit',
      bookData: item
    })
  }
  layout() {
    const list = [
      {
        key: 'fe',
        name: '前端',
        submenu: [
          {
            key: 'htmlcss',
            name: 'html+css'
          },
          {
            key: 'javascript',
            name: 'javascript'
          },
          {
            key: 'feframe',
            name: '前端框架'
          }
        ]
      },
      {
        key: 'be',
        name: '后端',
        submenu: [
          {
            key: 'php',
            name: 'php'
          },
          {
            key: 'java',
            name: 'java'
          }
        ]
      },
      {
        key: 'null',
        name: '未分类'
      }
    ]
    switch (this.state.type) {
      case 'book':
        const { data } = this.props.state.book
        let columns = [
          { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
          { title: '书名', dataIndex: 'title', key: 'title' },
          { title: '作者', dataIndex: 'author', key: 'author' },
          { title: '分类', dataIndex: 'type', key: 'type', render: (text) => text.join('/') },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
            <Button.Group>
              <Button onClick={this.editBook.bind(this, record)} type="primary">编辑</Button>
              <Button onClick={this.remove.bind(this, 'book', record.isbn)}>删除</Button>
            </Button.Group>
          )}
        ]
        return (
          <Layout className="main-layout">
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Content>
                <Button onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
              </Content>
              <Table
                columns={columns}
                dataSource={data}
                expandedRowRender={record => <p>{record.description}</p>}
              />
            </Content>
          </Layout>
        )
      case 'user':
        const { users } = this.props.state.user
        columns = [
          { title: '用户名', dataIndex: 'name', key: 'name' },
          { title: '权限', dataIndex: 'manage', key: 'manage' },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
            <Button.Group>
              {record.manage ?
                <Button type="primary" onClick={this.setManage.bind(this, record.name, 0)}>取消管理员</Button> :
                <Button type="primary" onClick={this.setManage.bind(this, record.name, 1)}>设为管理员</Button>}
              <Button onClick={this.remove.bind(this, 'user', record.name)}>删除</Button>
            </Button.Group>
          )}
        ]
        return (
          <Layout className="main-layout">
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Table
                columns={columns}
                dataSource={users}
              />
            </Content>
          </Layout>
        )
    }
  }
  showAddBookDialog(){
    this.setState({
      bookFormType: 'addbook',
      bookData: null,
      bookFormVisible: true
    })
  }
  handleSubmit( type, info ){
    // addBook({isbn:test})
    const { addBook, fetchBookData } = this.props.bookActions
    fetchBookData(type, Object.assign({token: localStorage.token}, info)).then(() => {
      const { resCode, message } = this.props.state.book
      this.showDialog({
        success: resCode,
        title: message,
        type: 'book',
        cb: fetchBookData.bind(null, 'book')
      })
      this.setState({
        bookFormVisible: false
      })
    })
  }
  handleCancel(){
    this.setState({
      bookFormVisible: false,
      bookData: null
    })
  }
  render(){
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.book
    const { message, name, books } = this.props.state.user
    const { bookInfo } = this.props.state.book

    const { addBook, fetchBookData } = this.props.bookActions

    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Content>
            <Button onClick={this.changeType.bind(this, 'book')} >管理图书</Button>
            <Button onClick={this.changeType.bind(this, 'user')} >管理用户</Button>
          </Content>
          {this.layout()}
        </Content>
        <BookForm title="请输入要添加书目的ISBN"
          visible={this.state.bookFormVisible}
          data={this.state.bookData}
          type={this.state.bookFormType}
          onSubmit={this.handleSubmit.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          />
       </Layout>
    )
  }
}
function mapState(state) {
  return {
    state: state
  }
}

function mapDispatch(dispatch) {
  return {
    bookActions: bindActionCreators(BookActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Admin)
