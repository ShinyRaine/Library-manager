import React from 'react'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/book.action'

import { Form, Input, Button, Modal, Cascader, Popover, message } from 'antd'
const FormItem = Form.Item

import { getTypeList, loadJSONP } from '../../api/tools'

class bookModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title: '',
      loading: false,
      loadedInfo: false
    }
  }
  resetForm() {
    const form = this.props.form
    form.resetFields()
    this.setState({
      title: '',
      loading: false,
      loadedInfo: false
    })
  }
  setForm( info ) {
    const form = this.props.form
    form.setFieldsValue({
      isbn: info.isbn,
      title: info.title,
      author: info.author,
      pic: info.pic,
      translator: info.translator,
      publishTime: info.publishTime,
      description: info.description
    })

    this.setState({
      title: '图书信息',
      loadedInfo: true,
      loading: false
    })
  }
  onCancel() {
    this.resetForm()
    this.props.onCancel()
  }
  handleInput() {
    const form = this.props.form
    let isbn = form.getFieldValue('isbn')
    if (isbn && isbn.match(/\d{13}/)) {
      this.setState({
        loading: true
      })
      loadJSONP('https://api.douban.com/v2/book/isbn/' + isbn).then((info) => {
        this.setForm({
          isbn: isbn,
          title: info.title,
          author: info.author,
          pic: info.image,
          translator: info.translator,
          publishTime: info.pubdate,
          description: info.summary
        })
      }).catch(err => {
        Modal.error({
          title: '获取信息超时，请重新尝试'
        })
      })
    } else {
      Modal.error({
        title: '请输入正确的Isbn'
      })
    }
  }
  handleSubmit() {
    const form = this.props.form
    form.validateFields((err, values) => {
      if (err) {
        console.log(err)
      }
      console.log(values);
      if (values.isbn) {
        if (this.props.onSubmit) {
          this.resetForm()
          this.props.onSubmit(this.props.type, values)
        }
      }
    })
  }
  render() {
    const form = this.props.form
    const { getFieldDecorator } = form
    const title = this.state.title || this.props.title
    const data = this.props.data || {}
    const types = getTypeList(this.props.state.type.data || [])
    return (
      <Modal
        title={title}
        visible={this.props.visible}
        onOk={this.handleSubmit.bind(this)}
        onCancel={this.onCancel.bind(this)}
        confirmLoading={this.state.loadedInfo}
        footer={ [
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleSubmit.bind(this)}>
            提交
          </Button>,
        ] }
        >
        <Form className="login-form">
        <FormItem
          label="isbn"
          required="true"
          >
          {getFieldDecorator('isbn', {
            initialValue: data.isbn || ''
          })(
            <Input ref={(input) => {this.isbnInput = input }}/>
          )}
          <Button onClick={this.handleInput.bind(this)}>获取信息</Button>
        </FormItem>
        <FormItem
          label="分类"
          required="true"
          >
          {getFieldDecorator('type', {
            initialValue: data.type || ['']
          })(
            <Cascader options={types} style={{display:'inline-block'}}/>
          )}
        </FormItem>
        <FormItem
          label="书名"
          required="true"
          >
          {getFieldDecorator('title', {
            initialValue: data.title || ''
          })(
            <Input ref={(input) => {this.titleInput = input }} />
          )}
        </FormItem>
        <FormItem
          label="作者"
          >
          {getFieldDecorator('author', {
            initialValue: data.author || ''
          })(
            <Input ref={(input) => {this.authorInput = input }} />
        )}
        </FormItem>
        <FormItem
          label="译者"
          >
          {getFieldDecorator('translator', {
            initialValue: data.translator || ''
          })(
            <Input ref={(input) => {this.translatorInput = input }} />
        )}
        </FormItem>
        <FormItem
          label="出版日期"
          >
          {getFieldDecorator('publishTime', {
            initialValue: data.publishTime || ''
          })(
            <Input ref={(input) => {this.publishTimeInput = input }}/>
        )}
        </FormItem>
        <FormItem
          label="简介"
          >
          {getFieldDecorator('description', {
            initialValue: data.description || ''
          })(
            <textarea ref={(input) => {this.descriptionInput = input }} style={{width: '100%'}}></textarea>
        )}
        </FormItem>
        <FormItem
          label="封面"
          >
          {getFieldDecorator('pic', {
            initialValue: data.pic || ''
          })(
            <Input ref={(input) => {this.picInput = input }}/>
          )}
        </FormItem>
        </Form>
      </Modal>
    )
  }
}
const BookForm = Form.create()(bookModal)

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

export default connect(mapState, mapDispatch)(BookForm)
