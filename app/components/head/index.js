import React from 'react'
import { browserHistory } from 'react-router'
import { Layout, Menu, Input } from 'antd'
import { Link } from 'react-router'
import './style.scss'
const { Header } = Layout

class Head extends React.Component {
  constructor(props){
    super(props)
  }
  search(value) {
    if (value) {
      if (this.props.onSearch) {
        this.props.onSearch(value)
      }
    }
  }
  logout() {
    localStorage.userName = ''
    localStorage.token = ''
    browserHistory.push('/')
  }
  render() {
    const user = this.props.user || ''
    let rightList = (name) => {
      if (name) {
        return (
          <Menu.SubMenu className="right-list" title={<Link to="/user" className="link">{name}</Link>}>
            <Menu.Item key="user">
              <Link to="/user">个人中心</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <a onClick={this.logout.bind(this)}>退出登录</a>
            </Menu.Item>
          </Menu.SubMenu>
        )
      } else {
        return (
          <Menu.SubMenu className="right-list" title={<Link to="/login" className="link">登录</Link>}>
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
            {rightList(user)}
            <Menu.Item key="" className="right-list search">
              {this.props.onSearch && <Input.Search
                        placeholder="搜索"
                        onSearch={this.search.bind(this)}
                      />}
            </Menu.Item>
          </Menu>
      </Header>
    )
  }
}

export default Head
