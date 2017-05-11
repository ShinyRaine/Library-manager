import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'

import * as UserActions from '../../actions/user.action'
import Head from '../../components/head'
import { Layout, Table, Button, Modal } from 'antd';

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
    const { fetchBookData } = this.props.bookActions
    fetchBookData('return', {
      token: localStorage.token,
      isbn: value.isbn
    })
  }
  render(){
    const { message, books } = this.props.state.user
    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'title', key: 'title' },
      { title: '分类', dataIndex: 'type', key: 'type',render: (text) => text.join('/') },
      { title: '借阅时间', dataIndex: 'borrowTime', key: 'borrowTime' },
      { title: '操作', dataIndex: '', key: 'admin', render: (text, record) => (
        <Button type="primary" onClick={this.onReturn.bind(this, record)}>归还</Button>
      )}
    ]
    return(
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
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
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(User)
