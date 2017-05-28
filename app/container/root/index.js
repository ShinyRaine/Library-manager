import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Modal, Table, Button, Select, Input, Cascader, message as Message } from 'antd'
const { Header, Content, Sider } = Layout

import './style.scss'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
import { getSideList, getFormList } from '../../api/tools'
import FloatBtn from '../../components/floatBtn'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      infoVisible: false,
      isbn: ''
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
    const { fetchBookData, fetchTypeData, resetSearch } = this.props.bookActions
    fetchBookData('borrow', {
      token: localStorage.token,
      isbn: value.isbn
    })
    .then(() => {
      const { resCode, message } = this.props.state.book
      if (resCode === "success") {
        Message.success(message)
        fetchBookData('book')
        resetSearch()
        this.setState({isbn: '', infoVisible: false})
      } else {
        Modal.error({
          title: '错误',
          content: message
        })
      }
    })
  }
  showInfo() {
    this.setState({infoVisible: true})
  }
  clearInfo () {
    this.setState({infoVisible: false, isbn: ''})
    const { resetSearch } = this.props.bookActions
    resetSearch()
  }
  handleOk () {
    const { searchRes } = this.props.state.book
    if (searchRes) {
      this.onBorrow(searchRes)
    }
  }
  handleInput (e) {
    const { fetchBookData, bookRequest } = this.props.bookActions
    let value = e.target.value
    this.setState({isbn: value})
    if (/^\d{13}$/.test(value)) {
      bookRequest()
      fetchBookData('search', {isbn: value})
    }
  }
  selectDevice(value) {
    this.setState({deviceId: value})
  }
  render(){
    const { message, books } = this.props.state.user
    const { data, filtedata, searchRes, loadingData } = this.props.state.book
    const list = getSideList( this.props.state.type.data || [] )
    const types = getFormList( this.props.state.type.data || [] )
    const columns = [
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
          <FloatBtn name="借书" onClick={this.showInfo.bind(this)} />
        </Content>
        <Modal
          title="输入isbn借书"
          visible={this.state.infoVisible}
          onCancel={this.clearInfo.bind(this)}
          confirmLoading={loadingData}
          footer={[
            <Button key="back" size="large" onClick={this.clearInfo.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" size="large" disabled={/^\d{13}$/.test(this.state.isbn) ? false : true} onClick={this.handleOk.bind(this)}>
              确认借书
            </Button>,
          ]}>
            <Input placeholder="输入isbn" value={this.state.isbn} onChange={this.handleInput.bind(this)} />
            {searchRes ? (
              <div className="infobox">
                <img src={searchRes.pic} />
                <div>
                  isbn: {searchRes.isbn} <br />
                  书名: {searchRes.title} <br />
                  作者: {searchRes.author} <br />
                </div>

              </div>
            ) : null}
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
