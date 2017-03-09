import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../../actions'
import Head from '../../components/head'
import BookTable from '../../components/booktable'
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

class User extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const data = [
      { key: 1, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js', state: 1, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 2, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js', state: 0, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 3, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js', state: 0, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 4, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js', state: 1, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' }
    ]
    return(
      <Layout>
        <Head />
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <BookTable data={data} type="user"/>
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
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(User)
