import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as UserActions from '../../actions/user.action'
import Head from '../../components/head'
import { Layout, Table, Button } from 'antd';

const { Header, Content, Sider } = Layout;

class User extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount() {
    const { fetchUserData } = this.props.userActions
  }
  render(){
    const { message, books } = this.props.state.user
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.book
    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'title', key: 'title' },
      { title: '分类', dataIndex: 'type', key: 'type' },
      { title: '借阅时间', dataIndex: 'time', key: 'time' },
      { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
        <Button type="primary">归还</Button>
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
                dataSource={data}
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
