import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Button, Modal, Table, message as Message, Cascader } from 'antd'
const { Header, Content, Sider } = Layout

import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
import BookForm from '../../components/bookForm'
import AddPopover from '../../components/addPopover'
import { getSideList,getFormList } from '../../api/tools'

import './style.scss'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'book',
      bookFormVisible: false,
      bookFormType: 'addbook',
      bookData: null
    }
  }
  componentWillMount() {
    const { fetchUserData } = this.props.userActions
    const token = localStorage.token
    if (!token) {
      this.showDialog({
        title: '请登录',
        type: 'user',
        cb: browserHistory.push.bind(null, '/login')
      })
    }
  }
  componentDidMount() {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const { fetchBookData, fetchTypeData } = this.props.bookActions
    const token = localStorage.token

    fetchUserData('checkManage', {token: token}).then(() => {
      const { resCode, manage, message } = this.props.state.user
      let routeTo = resCode === 'error' ? browserHistory.push.bind(null, '/login') : browserHistory.push.bind(null, '/')
      if (resCode === 'error' || manage == 0) {
        this.showDialog({
          title: resCode === 'error' ? message : '权限不足',
          type: 'user',
          cb: () => {
            routeTo()
            resetUserReq()
          }
        })
      } else {
        resetUserReq()
      }
    })
    fetchTypeData('all')
    fetchBookData('book')
    fetchUserData('user')
  }
  changeType(type) {
    this.setState({type: type})
  }
  handleFilter(value){
    const { filterBook } = this.props.bookActions
    filterBook(value)
  }
  showDialog(options) {
    const { resetUserReq } = this.props.userActions
    const { resetBookReq } = this.props.bookActions
    let reset = options.type === 'user' ? resetUserReq : resetBookReq
    if (options.success === "success") {
      return Modal.success({
        title: options.title,
        onOk: () => {
          options.cb()
          reset()
          return false
        }
      })
    }else {
      return Modal.error({
        title: options.title,
        onOk: () => {
          options.cb()
          reset()
          return false
        }
      })
    }
  }
  setManage(name, num) {
    const { fetchUserData, resetReq } = this.props.userActions
    fetchUserData('setManage', {
      token: localStorage.token,
      name: name,
      manage: num
    }).then(() => {
      const { resCode, message } = this.props.state.user
      this.showDialog({
        success: resCode,
        title: message,
        type: 'user',
        cb: fetchUserData.bind(null, 'user')
      })
    })
  }
  remove(type, id) {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    let fetchData, data, resCode, message
    switch (type) {
      case 'user':
        fetchData = fetchUserData
        data = {token: localStorage.token, name: id}
        break
      case 'book':
        fetchData = fetchBookData
        data = {token: localStorage.token, isbn: id}
        break
    }
    fetchData('remove', data).then(() => {
      this.showDialog({
        success: type === 'user' ? this.props.state.user.resCode : this.props.state.user.message,
        title: type === 'user' ? this.props.state.user.message : this.props.state.book.message,
        type: type,
        cb: fetchData.bind(null, type)
      })
    })
  }
  editBook(item) {
    this.setState({
      bookFormVisible: true,
      bookFormType: 'edit',
      bookData: item
    })
  }
  handleTypeSubmit( type, options ) {
    const { fetchTypeData } = this.props.bookActions
    fetchTypeData(type, Object.assign({token: localStorage.token}, options) )
      .then(() => {
        const { resCode, resMessage } = this.props.state.type
        if(resCode === 'success') {
          Message.success(resMessage)
          fetchTypeData('all')
        } else {
          Message.error(resMessage)
        }
      })
  }
  showBorrowInfo(record) {
    const info = record.meta
    const columns = [
      { title: '借阅人', dataIndex: 'borrowUser', key: 'borrowUser'},
      { title: '借阅时间', dataIndex: 'borrowTime', key: 'borrowTime', render: (text) => {
        let date = new Date(text)
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
      }}
    ]
    Modal.info({
      title: '借阅信息',
      content: <Table columns={columns} dataSource={info}/>
    })
  }
  layout() {
    const listData = this.props.state.type.data || []
    const list = getSideList( listData )
    const types = getFormList( listData )
    switch (this.state.type) {
      case 'book':
        const { data, filtedata } = this.props.state.book
        const deviceWidth = document.documentElement.clientWidth
        let columns = [
          { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
          { title: '书名', dataIndex: 'title', key: 'title' },
          { title: '作者', dataIndex: 'author', key: 'author' },
          { title: '分类',
            dataIndex: 'type',
            key: 'type',
            render: (text) => text.join('/'),
            filterDropdown: (
              <Cascader options={types} onChange={this.handleFilter.bind(this)}/>
            )},
          { title: '总数', dataIndex: 'sumNum', key: 'sumNum' },
          { title: '借出数', dataIndex: 'borrowNum', key: 'borrowNum', render: (text, record) => {
            if (text) {
              return <a onClick={this.showBorrowInfo.bind(this, record)}>{text}</a>
            } else {
              return <span>{text}</span>
            }
          } },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => {
            if (deviceWidth < 600) {
              return(<div className="btns">
              <Button onClick={this.editBook.bind(this, record)} type="primary">编辑</Button>
              <Button onClick={this.remove.bind(this, 'book', record.isbn)}>删除</Button>
            </div>)
            } else {
              return (
              <Button.Group>
                <Button onClick={this.editBook.bind(this, record)} type="primary">编辑</Button>
                <Button onClick={this.remove.bind(this, 'book', record.isbn)}>删除</Button>
              </Button.Group>
            )
            }
        }}
        ]
        const popovers = [<AddPopover key="add" name="添加类目" proList={listData} onSubmit={this.handleTypeSubmit.bind(this, 'addtype')} />,
                          <AddPopover key="delet" name="删除类目" proList={listData} onSubmit={this.handleTypeSubmit.bind(this, 'removetype')} />]
        const bar = deviceWidth < 600 ? (
          <div>
            <Sidebar defaultSelecte={this.props.state.book.type} list={list} action={this.handleFilter.bind(this)}/>
            <div className="btns">
              { popovers }
              <Button type="primary" className="addbookbtn" onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
              </div>
          </div>
        ) : (
          <Sider width={200} style={{ background: '#fff' }}>
            { popovers }
            <Sidebar defaultSelecte={this.props.state.book.type} list={list} action={this.handleFilter.bind(this)}/>
          </Sider>)
        return (
          <Layout className="main-layout">
            { bar }
            <Content className="main-content">
              { deviceWidth < 600 ? null : (
                <Content>
                  <Button className="addbookbtn" onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
                </Content>
              )}
              <Table
                columns={columns}
                dataSource={filtedata || data}
                expandedRowRender={record => <p>{record.description}</p>}
              />
            </Content>
          </Layout>
        )
      case 'user':
        const { users } = this.props.state.user
        columns = [
          { title: '用户名', dataIndex: 'name', key: 'name' },
          { title: '权限', dataIndex: 'manage', key: 'manage' },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
            <Button.Group>
              {record.manage ?
                <Button type="primary" onClick={this.setManage.bind(this, record.name, 0)}>取消管理员</Button> :
                <Button type="primary" onClick={this.setManage.bind(this, record.name, 1)}>设为管理员</Button>}
              <Button onClick={this.remove.bind(this, 'user', record.name)}>删除</Button>
            </Button.Group>
          )}
        ]
        return (
          <Layout className="main-layout">
            <Content className="main-content">
              <Table
                columns={columns}
                dataSource={users}
              />
            </Content>
          </Layout>
        )
    }
  }
  showAddBookDialog(){
    this.setState({
      bookFormType: 'addbook',
      bookData: null,
      bookFormVisible: true
    })
  }
  handleSubmit( type, info ){
    // addBook({isbn:test})
    const { addBook, fetchBookData } = this.props.bookActions
    fetchBookData(type, Object.assign({token: localStorage.token}, info)).then(() => {
      const { resCode, message } = this.props.state.book
      this.showDialog({
        success: resCode,
        title: message,
        type: 'book',
        cb: fetchBookData.bind(null, 'book')
      })
      this.setState({
        bookFormVisible: false
      })
    })
  }
  handleCancel(){
    this.setState({
      bookFormVisible: false,
      bookData: null
    })
  }
  render(){
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.book
    const { message, name, books } = this.props.state.user
    const { bookInfo } = this.props.state.book

    const { addBook, fetchBookData } = this.props.bookActions

    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content className="warp">
          <Content className="adminbar">
            <Button onClick={this.changeType.bind(this, 'book')} >管理图书</Button>
            <Button onClick={this.changeType.bind(this, 'user')} >管理用户</Button>
          </Content>
          {this.layout()}
        </Content>
        <BookForm title="请输入要添加书目的ISBN"
          visible={this.state.bookFormVisible}
          data={this.state.bookData}
          type={this.state.bookFormType}
          onSubmit={this.handleSubmit.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          />
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

export default connect(mapState, mapDispatch)(Admin)
