import React from 'react'
import { Layout, Menu, Input } from 'antd'
import { Link } from 'react-router'

const { Header } = Layout

class Head extends React.Component {
  constructor(props){
    super(props)
  }
  search(value) {
    console.log(value)
  }
  render(){
    return (
      <Header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="root"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="user"><Link to="/user">个人中心</Link></Menu.Item>
            <Menu.Item key="admin"><Link to="/admin">管理</Link></Menu.Item>
            <Menu.Item key="" style={{float: 'right'}}>
              <Input.Search
                        placeholder="搜索"
                        style={{ width: 200,color: '#000' }}
                        onSearch={this.search.bind(this)}
                      />
            </Menu.Item>
          </Menu>

      </Header>
    )
  }
}

export default Head
