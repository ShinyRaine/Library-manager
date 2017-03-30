import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as UserActions from '../../actions/user.action'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import { Layout, Icon, Form, Input, Button, Modal } from 'antd'
const { Content } = Layout
const FormItem = Form.Item;
import Head from '../../components/head'

import './style.scss'
class Login extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate() {
    const { resetReq } = this.props.userActions
    const { message } = this.props.state.user
    if (message) {
      if (message === "success") {
        Modal.success({
          title: '登录成功',
          onOk: function(){
            resetReq()
            browserHistory.push('/')
            return false
          }
        })
      }else {
        Modal.error({
          title: '登录失败',
          content: message,
          onOk: function(){
            resetReq()
            return false
          }
        })
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    const { fetchUserData } = this.props.userActions
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          fetchUserData('login', values)
        }
    })
  }
  render(){
    const { message, books } = this.props.state.user
    const { getFieldDecorator } = this.props.form
    return (
      <Layout className="login">
        <Head user={localStorage.userName}/>
        <Content>
          <h1>登录</h1>
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input addonBefore={<Icon type="user" />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              Or <Link to="/signup">注册</Link>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    )
  }
}
const LoginForm = Form.create()(Login);
function mapState(state) {
  return {
    state: state
  }
}

function mapDispatch(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(LoginForm)
