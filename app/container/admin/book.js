import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Button, Modal, Table, message, Cascader } from 'antd'
const { Content, Sider } = Layout

import AddPopover from '../../components/addPopover'
import Sidebar from '../../components/sidebar'

import { getSideList,getFormList } from '../../api/tools'


class BookAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bookFormVisible: false,
      bookFormType: 'addbook',
      bookData: null
    }
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
          message.success(resMessage)
          fetchTypeData('all')
        } else {
          message.error(resMessage)
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
  render(){
    const listData = this.props.state.type.data || []
    const list = getSideList( listData )
    const types = getFormList( listData )
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
          return <a onClick={this.showBorrowInfo.bind(this, record)}>{text} 查看借阅信息</a>
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
        <Sidebar list={list} action={this.handleFilter.bind(this)}/>
        <div className="btns">
          { popovers }
          <Button type="primary" className="addbookbtn" onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
          </div>
      </div>
    ) : (
      <Sider width={200} style={{ background: '#fff' }}>
        { popovers }

        <Sidebar list={list} action={this.handleFilter.bind(this)}/>
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

export default connect(mapState, mapDispatch)(BookAdmin)
