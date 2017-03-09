import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import { Layout, Icon, Form, Input, Button, Checkbox } from 'antd';
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
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      })
  }
  handleBlur() {
    const form = this.props.form
    let password = form.getFieldValue('password')
    let passwordRepeat = form.getFieldValue('repeat')
    if (passwordRepeat !== password) {
      this.setState({passwordStatus : 'error', help: '请输入一致的密码'})
      console.log(this.state)
    } else {
      this.setState({passwordStatus : '', help: ''})
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout className="login">
        <Head />
        <Content>
          <h1>注册</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
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
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(SignupForm)
