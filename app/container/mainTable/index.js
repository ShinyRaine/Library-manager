import React from 'react'
import { Table, Button, Modal } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

class MainTable extends React.Component {
  constructor(props) {
    super(props)
  }
  showDialog(options) {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const { fetchBookData, resetBookReq } = this.props.bookActions
    let fetchData, reset
    switch (options.type) {
      case 'user':
        fetchData = fetchUserData
        reset = resetUserReq
        break
      case 'book':
        fetchData = fetchBookData
        reset = resetBookReq
        break
    }
    if (options.success) {
      return Modal.success({
        title: options.title,
        onOk: () => {
          fetchData(options.type)
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
      const { message } = this.props.state.user
      this.showDialog({
        success: true,
        title: message,
        type: 'user'
      })
    })
  }
  remove(type, id) {
    const { fetchUserData } = this.props.userActions
    const { fetchBookData } = this.props.bookActions
    let fetchData, data
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
        success: true,
        title: (type === 'user' ? this.props.state.user.message : this.props.state.book.message),
        type: type
      })
    })
  }
  getColumns(type) {
    switch (type) {
      case 'user':
        return [
          { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
          { title: '书名', dataIndex: 'name', key: 'name' },
          { title: '分类', dataIndex: 'type', key: 'type' },
          { title: '借阅时间', dataIndex: 'time', key: 'time' },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
            <Button type="primary">归还</Button>
          )}
        ]
      case 'admin':
        return [
          { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
          { title: '书名', dataIndex: 'name', key: 'name' },
          { title: '作者', dataIndex: 'author', key: 'author' },
          { title: '分类', dataIndex: 'type', key: 'type' },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (
            <Button.Group>
              <Button type="primary">编辑</Button>
              <Button onClick={this.remove.bind(this, 'book', record.isbn)}>删除</Button>
            </Button.Group>
          )}
        ]
      case 'userList':
        return  [
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
      default:
        return [
          { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
          { title: '书名', dataIndex: 'name', key: 'name' },
          { title: '作者', dataIndex: 'author', key: 'author' },
          { title: '分类', dataIndex: 'type', key: 'type' },
          { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => {
              if (record.state == 0) {
                return <Button type="primary">借出</Button>
              } else if (record.state == 1) {
                return <span>已借</span>
              }
          }}
        ]

    }
  }
  render(){
    const data = this.props.data
    const type = this.props.type
    const columns = this.getColumns(type)
    return (
      <Table
        columns={columns}
        expandedRowRender={record => type === 'default' ? (<p>{record.description}</p>) : null}
        dataSource={data}
      />
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

export default connect(mapState, mapDispatch)(MainTable)
