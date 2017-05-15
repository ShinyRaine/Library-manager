import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Modal, Table, Button, Input, Cascader, message as Message } from 'antd'
const { Header, Content, Sider } = Layout

import './style.scss'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
import { getSideList, getFormList } from '../../api/tools'
import Scanner from '../../components/scanner'
class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scannerVisible: true,
      scannedCode: '',
      infoVisible: false,
      bookInfo: null
    }
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
  onBorrow(value) {
    const { fetchBookData, fetchTypeData } = this.props.bookActions
    fetchBookData('borrow', {
      token: localStorage.token,
      isbn: value.isbn
    })
    .then(() => {
      const { resCode, message } = this.props.state.book
      if (resCode === "success") {
        Message.success(message)
        fetchBookData('book')
      } else {
        Modal.error({
          title: '错误',
          content: message
        })
      }
    })
  }
  handleResult (result) {
    this.stopScanning()
    const scannedCode = result.codeResult.code
    this.setState({scannedCode : scannedCode})
    const { fetchBookData, fetchTypeData } = this.props.bookActions
    console.log(scannedCode)
    if (scannedCode) {
      fetchBookData('search', {
        data: {isbn: scannedCode}
        token: localStorage.token
      })
    }
  }
  stopScanning () {
    this.setState({scannerVisible: false})
  }
  clearInfo () {
    this.setState({infoVisible: false, bookInfo: null})
  }
  handleOk () {
    const { searchRes } = this.props.state.book
    if (searchRes) {
      this.onBorrow(searchRes)
    }
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
      { title: '数量', dataIndex: 'num', key: 'num', render: (text, record) => <span>{record.sumNum - record.borrowNum}</span> },
      { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => {
          if (record.sumNum - record.borrowNum > 0) {
            return <Button type="primary" onClick={this.onBorrow.bind(this, record)}>借出</Button>
          } else {
            return <span>已借</span>
          }
      }}
    ]
    const deviceWidth = document.documentElement.clientWidth
    const bar = deviceWidth < 600 ? (
      <Sidebar list={list} action={this.handleFilter.bind(this)}/>

    ) : (
      <Sider width={200} style={{ background: '#fff' }}>
        <Sidebar list={list} action={this.handleFilter.bind(this)}/>
      </Sider>)
    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content className="warp">
          <Layout className="main-layout">
            {bar}
            <Content className="main-content">
              <Table
                columns={columns}
                dataSource={filtedata || data}
                expandedRowRender={record => <p>{record.description}</p>}
              />
            </Content>
          </Layout>
        </Content>
        <Modal
          visible={this.state.scannerVisible}
          onCancel={this.stopScanning.bind(this)}>
          <Scanner
            onDetected={this.handleResult.bind(this)}
            onCancel={this.stopScanning.bind(this)}/>
        </Modal>
        <Modal
          visible={this.state.infoVisible}
          onCancel={this.clearInfo.bind(this)}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>
              确认借书
            </Button>,
          ]}>
            <Input placeholder="输入isbn"/> <Button>扫描条码</Button>
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

export default connect(mapState, mapDispatch)(Root)
