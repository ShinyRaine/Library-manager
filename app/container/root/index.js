import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Modal, Table, Button, Cascader } from 'antd'
const { Header, Content, Sider } = Layout

import './style.scss'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
import { getSideList, getFormList } from '../../api/tools'

class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { fetchBookData, fetchTypeData } = this.props.bookActions
    fetchBookData('book')
    fetchTypeData('all')
  }
  handleFilter(value){
    const { filterBook } = this.props.bookActions
    filterBook(value)
  }
  render(){
    const { message, books } = this.props.state.user
    const { data, filtedata } = this.props.state.book
    const list = getSideList( this.props.state.type.data || [] )
    const types = getFormList( this.props.state.type.data || [] )
    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'title', key: 'title' },
      { title: '作者', dataIndex: 'author', key: 'author' },
      { title: '分类',
        dataIndex: 'type',
        key: 'type',
        render: (text) => text.join('/'),
        filterDropdown: (
          <Cascader options={types} onChange={this.handleFilter.bind(this)}/>
        )
     },
      { title: '数量', dataIndex: 'num', key: 'num' },
      { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => {
          if (record.state == 0) {
            return <Button type="primary">借出</Button>
          } else if (record.state == 1) {
            return <span>已借</span>
          }
      }}
    ]
    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Layout className="main-layout">
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list} action={this.handleFilter.bind(this)}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Table
                columns={columns}
                dataSource={filtedata || data}
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

export default connect(mapState, mapDispatch)(Root)
