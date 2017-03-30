import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as UserActions from '../../actions/user.action'
import Head from '../../components/head'
import MainTable from '../mainTable'
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

class User extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const { message, books } = this.props.state.user
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.books

    return(
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <MainTable data={data} type="user"/>
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
