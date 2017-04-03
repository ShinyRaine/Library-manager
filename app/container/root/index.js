import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Modal } from 'antd'
const { Header, Content, Sider } = Layout

import './style.scss'
import MainTable from '../mainTable'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'

class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const token = localStorage.token
    fetchUserData('checkManage', {token: token}).then(() => {
      const { message } = this.props.state.user
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
    })
    const { fetchBookData } = this.props.bookActions
    fetchBookData('book')
  }
  render(){
    const { message, books } = this.props.state.user
    const { data } = this.props.state.book
    if (data) {
      data.map((item) => Object.assign(item, {key: item._id}))
    }
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
    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Layout className="main-layout">
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <MainTable data={data}/>
            </Content>
          </Layout>
        </Content>
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

export default connect(mapState, mapDispatch)(Root)
