import React from 'react'
import { Table, Button } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/book.action'

class BookTable extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const data = this.props.data
    const type = this.props.type || 'default'
    const columns = {
      default: [
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
      ],
      user: [
        { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
        { title: '书名', dataIndex: 'name', key: 'name' },
        { title: '作者', dataIndex: 'author', key: 'author' },
        { title: '分类', dataIndex: 'type', key: 'type' },
        { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (<Button type="primary">归还</Button>)}
      ],
      admin: [
        { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
        { title: '书名', dataIndex: 'name', key: 'name' },
        { title: '作者', dataIndex: 'author', key: 'author' },
        { title: '分类', dataIndex: 'type', key: 'type' },
        { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => (<Button type="primary">删除</Button>)}
      ]
    }

    return (
      <Table
        columns={columns[type]}
        expandedRowRender={record => <p>{record.description}</p>}
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
    bookActions: bindActionCreators(BookActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(BookTable)
