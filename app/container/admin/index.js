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
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'book',
      addBookVisible: false,
      loadingBookInfor: false
    }
  }
  componentWillMount() {
    const { manage, message } = this.props.state.user
    const { fetchUserData } = this.props.userActions
    const token = localStorage.token
    if (token) {
      fetchUserData('checkManage', {token: localStorage.token})
      if (manage === 0) {
        Modal.error({
          title: '错误',
          content: '权限不足',
          onOk: () => {
            browserHistory.push('/')
          }
        })
      }
    } else {
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
    const { fetchBookData } = this.props.bookActions
    fetchBookData('books')
  }
  changeType(type) {
    this.setState({type: type})
  }
  layout() {
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.books

    const { message, books } = this.props.state.user

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
      }
    ]
    switch (this.state.type) {
      case 'book':
        return (
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
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
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <MainTable data={data} type="userList"/>
            </Content>
          </Layout>
        )
      default:

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
    let test = this.isbnInput.value
    addBook({isbn:test})
    fetchBookData('addbook', {isbn:test})
    this.setState({
      addBookVisible: false
    })
  }
  handleCancel(){
    this.setState({
      addBookVisible: false
    })
  }
  render(){
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.books
    const { message, name, books } = this.props.state.user
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
        <Modal title="请输入要添加书目的ISBN"
          visible={this.state.addBookVisible}
          onOk={this.handleOk.bind(this)}
          confirmLoading={this.state.loadingBookInfor}
          onCancel={this.handleCancel.bind(this)}>
          <input ref={(input)=>{this.isbnInput = input}}/>
        </Modal>
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
