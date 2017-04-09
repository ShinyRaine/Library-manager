import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router'

const { Sider } = Layout
const { SubMenu } = Menu

class Sidebar extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const list = this.props.list

    const menu = list.map((item) => {
      if ( item.submenu && item.submenu.length !== 0  ) {
        const submenu = item.submenu.map((i) => <Menu.Item key={i.key}>{i.name}</Menu.Item>)
        return(
          <SubMenu key={item.key} title={<span>{item.name}</span>}>
          {submenu}
          </SubMenu>
        )
      } else {
        return <Menu.Item key={item.key}>{item.name}</Menu.Item>
      }
    })

    return (
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          {menu}
        </Menu>
    )
  }
}

export default Sidebar
