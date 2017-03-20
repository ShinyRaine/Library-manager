import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/book.action'

import { Layout } from 'antd';
const { Header, Content, Sider } = Layout

import BookTable from '../../components/booktable'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'

class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { fetchBookData } = this.props.bookActions
    fetchBookData('books')
  }
  render(){
    console.log(this.props.state)
    const { data } = this.props.state.books
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
    bookActions: bindActionCreators(BookActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Root)
