import { Table, Button } from 'antd';
import React from 'react'

class BookTable extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const data = this.props.data

    const columns = [
      { title: 'ISBN', dataIndex: 'ISBN', key: 'ISBN' },
      { title: '书名', dataIndex: 'name', key: 'name' },
      { title: '作者', dataIndex: 'author', key: 'author' },
      { title: '分类', dataIndex: 'type', key: 'type' },
      { title: '操作', dataIndex: '', key: 'x', render: () => {
        return <Button type="primary">借出</Button>
        }
      },
    ]
    return (
      <Table
        columns={columns}
        expandedRowRender={record => <p>{record.description}</p>}
        dataSource={data}
      />
    )
  }
}

export default BookTable
