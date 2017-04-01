import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from '../../actions/user.action'
import { browserHistory } from 'react-router'

import { Layout, Icon, Form, Input, Button, Checkbox, Modal } from 'antd';
const { Content } = Layout
const FormItem = Form.Item;
import Head from '../../components/head'

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      passwordStatus : '',
      help: ''
    }
  }
  componentDidUpdate() {
    const { resetUserReq } = this.props.userActions
    const { message, books } = this.props.state.user
    if (message) {
      if (message === "success") {
        Modal.success({
          title: '注册成功',
          onOk: function(){
            resetUserReq()
            browserHistory.push('/')
            return false
          }
        })
      }else {
        Modal.error({
          title: '注册失败',
          content: message,
          onOk: function(){
            resetUserReq()
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
          fetchUserData('signup', values)
        }
    })
  }
  handleBlur() {
    const form = this.props.form
    let password = form.getFieldValue('password')
    let passwordRepeat = form.getFieldValue('repeat')
    if (passwordRepeat !== password) {
      this.setState({passwordStatus : 'error', help: '请输入一致的密码'})
    } else {
      this.setState({passwordStatus : '', help: ''})
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const { message, books } = this.props.state.user

    return (
      <Layout className="login">
        <Head user={localStorage.userName}/>
        <Content>
          <h1>注册</h1>
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input placeholder="输入用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input type="password" placeholder="输入密码" />
              )}
            </FormItem>
            <FormItem validateStatus={this.state.passwordStatus}
              help={this.state.help}>
              {getFieldDecorator('repeat', {
                rules: [{ required: true, message: '请再次输入密码' }],
              })(
                <Input onBlur={this.handleBlur.bind(this)} type="password" placeholder="再次输入密码" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                注册
              </Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    )
  }
}
const SignupForm = Form.create()(Signup);
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

export default connect(mapState, mapDispatch)(SignupForm)
