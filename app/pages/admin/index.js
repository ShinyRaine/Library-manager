import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/book.action'

import { Layout, Button, Modal } from 'antd';
const { Header, Content, Sider } = Layout;

import BookTable from '../../components/booktable'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addBookVisible: false,
      loadingBookInfor: false
    }
  }
  componentDidMount() {
    const { fetchBookData } = this.props.bookActions
    fetchBookData('books')
  }
  showAddBookDialog(){
    this.setState({
      addBookVisible: true
    })
  }
  handleOk(){
    const { addBook, fetchBookData } = this.props.bookActions
    let test = this.isbnInput.value
    addBook({isbn:test})
    fetchBookData('addbook', {isbn:test})
    this.setState({
      addBookVisible: false
    })
  }
  handleCancel(){
    this.setState({
      addBookVisible: false
    })
  }
  render(){
    const { data, addBookInfo, receiveAddbookRes } = this.props.state.books
    console.log(addBookInfo, receiveAddbookRes)
    const list = [
      {
        key: 'fe',
        name: '前端',
        submenu: [
          {
            key: 'htmlcss',
            name: 'html+css'
          },
          {
            key: 'javascript',
            name: 'javascript'
          },
          {
            key: 'feframe',
            name: '前端框架'
          }
        ]
      },
      {
        key: 'be',
        name: '后端',
        submenu: [
          {
            key: 'php',
            name: 'php'
          },
          {
            key: 'java',
            name: 'java'
          }
        ]
      }
    ]
    return (
      <Layout>
        <Head user={this.props.state.user}/>
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Content>
                <Button onClick={this.showAddBookDialog.bind(this)}>添加书目</Button>
              </Content>
              <BookTable data={data} type="admin"/>
            </Content>
          </Layout>
        </Content>
        <Modal title="请输入要添加书目的ISBN"
          visible={this.state.addBookVisible}
          onOk={this.handleOk.bind(this)}
          confirmLoading={this.state.loadingBookInfor}
          onCancel={this.handleCancel.bind(this)}>
          <input ref={(input)=>{this.isbnInput = input}}/>
        </Modal>
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
    bookActions: bindActionCreators(BookActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Admin)
