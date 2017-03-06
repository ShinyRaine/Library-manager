import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import { Link } from 'react-router'

import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

import BookTable from '../../components/booktable'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
// 我是新手会写错啦啦啦，API也设计不好。。
class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    // 假定图书状态state，未借是0，借出1
    const data = [
      { key: 1, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js',state: 1, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 2, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js',state: 0, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 3, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js',state: 0, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 4, ISBN: 32444444, name: 'John Brown', author: 'John Brown', type: '前端/js',state: 1, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' }
    ]
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
        <Head />
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <BookTable data={data}/>
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

export default connect(mapState, mapDispatch)(Root)
