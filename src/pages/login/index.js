import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import { Layout, Icon, Form, Input, Button, Checkbox } from 'antd';
const { Content } = Layout
const FormItem = Form.Item;
import Head from '../../components/head'

class Login extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout>
        <Head />
        <Content style={{padding: "50px"}}>
          <Form onSubmit={this.handleSubmit} className="login-form">
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
              <a className="login-form-forgot">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a>register now!</a>
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
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(LoginForm)
