import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'

import * as UserActions from '../../actions/user.action'
import * as BookActions from '../../actions/book.action'
import Head from '../../components/head'
import { Layout, Table, Button, Modal, message as Message } from 'antd';

const { Header, Content, Sider } = Layout;

class User extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount() {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const token = localStorage.token
    fetchUserData("getBorrowed", {token: token})
    .then(() => {
      const { resCode, message } = this.props.state.user
      if (resCode === 'error') {
        Modal.error({
          title: '错误',
          content: message,
          onOk: () => {
            browserHistory.push('/login')
            resetUserReq()
          }
        })
      }
    })
  }
  onReturn(value) {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    fetchBookData('return', {
      token: localStorage.token,
      isbn: value.isbn,
      borrowTime: +new Date(value.borrowTime)
    })
    .then(() => {
      const { resCode, message } = this.props.state.book
      if (resCode === "success") {
        Message.success(message)
        fetchUserData("getBorrowed", {token: localStorage.token})
      } else {
        Modal.error({
          title: '错误',
          content: message
        })
      }
    })
  }
  render(){
    const { message, books } = this.props.state.user
    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'title', key: 'title' },
      { title: '分类', dataIndex: 'type', key: 'type',render: (text) => text.join('/') },
      { title: '借阅时间', dataIndex: 'borrowTime', key: 'borrowTime', render: (text) => {
        let date = new Date(text)
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
      } },
      { title: '操作', dataIndex: '', key: 'admin', render: (text, record) => (
        <Button type="primary" onClick={this.onReturn.bind(this, record)}>归还</Button>
      )}
    ]
    return(
      <Layout>
        <Head user={localStorage.userName}/>
        <Content className="warp">
          <Layout className="main-layout">
            <Content className="main-content">
              <Table
                columns={columns}
                dataSource={books}
                expandedRowRender={record => <p>{record.description}</p>}
              />
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

export default connect(mapState, mapDispatch)(User)
