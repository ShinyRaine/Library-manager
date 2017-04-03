import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Button, Modal } from 'antd'
const { Header, Content, Sider } = Layout

import MainTable from '../mainTable'
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
            browserHistory.push('/login')
            resetUserReq()
          }
        })
      }
      if (manage === 0) {
        Modal.error({
          title: '错误',
          content: '权限不足',
          onOk: () => {
            browserHistory.push('/')
            resetUserReq()
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
  layout() {
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.book

    const { message, books, users } = this.props.state.user

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
        return (
          <Layout className="main-layout">
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Content>
                <Button onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
              </Content>
              <MainTable data={data} type="admin"/>
            </Content>
          </Layout>
        )
      case 'user':
        return (
          <Layout className="main-layout">
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <MainTable data={users} type="userList"/>
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
  handleOk(){
    const { message, books } = this.props.state.user
    const { addBook, fetchBookData } = this.props.bookActions
    let isbn = this.isbnInput.value
    // addBook({isbn:test})
    // fetchBookData('addbook', {isbn:test})
    this.setState({
      addBookVisible: false,
      bookToAdd: isbn
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
