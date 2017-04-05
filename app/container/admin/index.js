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
      addBookVisible: false
    }
  }
  componentWillMount() {
    const { fetchUserData } = this.props.userActions
    const token = localStorage.token
    if (!token) {
      Modal.error({
        title: '错误',
        content: '请登录',
        onOk: () => {
          browserHistory.push('/login')
        }
      })
    }
  }
  componentDidMount() {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const token = localStorage.token

    fetchUserData('checkManage', {token: token}).then(() => {
      const { manage, message } = this.props.state.user
      if (message === 'TokenExpiredError') {
        Modal.error({
          title: '错误',
          content: '登录过期 请重新登录',
          onOk: () => {
            resetUserReq()
            browserHistory.push('/login')
          }
        })
      }
      if (manage === 0) {
        Modal.error({
          title: '错误',
          content: '权限不足',
          onOk: () => {
            resetUserReq()
            browserHistory.push('/')
          }
        })
      }
    })

    const { fetchBookData } = this.props.bookActions
    fetchBookData('book')
    fetchUserData('user')
  }
  changeType(type) {
    this.setState({type: type})
  }
  showDialog(options) {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const { fetchBookData, resetBookReq } = this.props.bookActions
    let fetchData, reset
    switch (options.type) {
      case 'user':
        fetchData = fetchUserData
        reset = resetUserReq
        break
      case 'book':
        fetchData = fetchBookData
        reset = resetBookReq
        break
    }
    if (options.success) {
      return Modal.success({
        title: options.title,
        onOk: () => {
          fetchData(options.type)
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
      const { message } = this.props.state.user
      this.showDialog({
        success: true,
        title: message,
        type: 'user'
      })
    })
  }
  remove(type, id) {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    let fetchData, data
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
        success: true,
        title: (type === 'user' ? this.props.state.user.message : this.props.state.book.message),
        type: type
      })
    })
  }
  editBook(item) {
    console.log(item);
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
          { title: '书名', dataIndex: 'name', key: 'name' },
          { title: '作者', dataIndex: 'author', key: 'author' },
          { title: '分类', dataIndex: 'type', key: 'type' },
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
      addBookVisible: true
    })
  }
  handleOk( info ){
    const { message, books } = this.props.state.user
    const { addBook, fetchBookData } = this.props.bookActions
    console.log(info)
    // addBook({isbn:test})
    fetchBookData('addbook', info).then(() => {
      this.setState({
        addBookVisible: false
      })
      fetchBookData('book')
    })
  }
  handleCancel(){
    this.setState({
      addBookVisible: false
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
          visible={this.state.addBookVisible}
          onSubmit={this.handleOk.bind(this)}
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
