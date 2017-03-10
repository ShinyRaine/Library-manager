import { Table, Button } from 'antd';
import React from 'react'

class BookTable extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const data = this.props.data

    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'name', key: 'name' },
      { title: '作者', dataIndex: 'author', key: 'author' },
      { title: '分类', dataIndex: 'type', key: 'type' },
      { title: '操作', dataIndex: '', key: 'x', render: (text,record) => {
          if (record.state == 0) {
            return <Button type="primary">借出</Button>
          } else if (record.state == 1) {
            return <span>已借</span>
          }
      }}
    ]
    const userColumns =  [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'name', key: 'name' },
      { title: '作者', dataIndex: 'author', key: 'author' },
      { title: '分类', dataIndex: 'type', key: 'type' },
      { title: '操作', dataIndex: '', key: 'x', render: (text,record) => (<Button type="primary">归还</Button>)}
    ]

    return (
      <Table
        columns={this.props.type === 'user' ? userColumns : columns}
        expandedRowRender={record => <p>{record.description}</p>}
        dataSource={data}
      />
    )
  }
}

export default BookTable
