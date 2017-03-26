import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from '../../actions/user.action'
import { Link } from 'react-router'

import { Layout, Icon, Form, Input, Button, Checkbox } from 'antd'
const { Content } = Layout
const FormItem = Form.Item;
import Head from '../../components/head'

import './style.scss'
class Login extends React.Component {
  constructor(props) {
    super(props)
  }
  handleSubmit(e) {
    e.preventDefault()
    const { fetchData } = this.props.userActions
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          fetchData('login', values)
        }
    })
  }
  render(){
    const { message, info, books } = this.props.state.user
    let user
    if (info) {
      user = info.user
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout className="login">
        <Head user={user}/>
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
