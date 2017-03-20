import React from 'react'
import { Layout, Menu, Input } from 'antd'
import { Link } from 'react-router'
import './style.scss'
const { Header } = Layout

class Head extends React.Component {
  constructor(props){
    super(props)
  }
  search(value) {
    console.log(value)
  }
  render(){
    const user = this.props.user
    let rightList = (name) => {
      if (name) {
        return <Menu.Item key="user" className="right-list"><Link to="/user">{user.name}</Link></Menu.Item>
      } else {
        return (
          <Menu.SubMenu className="right-list" title={<Link to="/login" className="login-link">登录</Link>}>
            <Menu.Item key="signup">
              <Link to="/signup">注册</Link>
            </Menu.Item>
          </Menu.SubMenu>
        )
      }
    }
    return (
      <Header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="root"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="admin"><Link to="/admin">管理</Link></Menu.Item>
            {rightList(user.name)}
            <Menu.Item key="" className="right-list">
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
