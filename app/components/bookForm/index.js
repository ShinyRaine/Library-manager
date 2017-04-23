import React from 'react'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import { Form, Input, Button, Modal, Cascader, Popover } from 'antd'
const FormItem = Form.Item
import AddPopover from '../addPopover'
import Text from '../test'

// JSONP的 promise 封装
function loadJSONP(url) {
  const timeout = 5000
  let timer
  return new Promise((resolve, reject) => {
    window.jsonpfn = function (res) {
      clearTimeout(timer)
      resolve(res)
      removeScript()
    }

    let script = document.createElement("script")
    script.id = 'jsonp'
    script.src = url + "?callback=jsonpfn"
    document.head.appendChild(script)

    timer = setTimeout(() => {
      reject('timeout')
      document.head.removeChild(script)
    }, timeout)
  });
}

function removeScript () {
  let script = document.getElementById('jsonp')
  document.head.removeChild(script)
}

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
    const types = [{
        value: 'fe',
        label: '前端',
        children: [{
          value: 'htmlcss',
          label: 'htmlcss'
        },{
          value: 'javascript',
          label: 'javascript'
        },{
          value: 'feframe',
          label: '前端框架'
        }],
      }, {
        value: 'be',
        label: '后端',
        children: [{
          value: 'php',
          label: 'php',
        },{
          value: 'java',
          label: 'java',
        },{
          value: '数据库',
          label: '数据库',
        }],
      },{
        value: '未分类',
        label: '未分类'
      }]
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
            <Cascader options={types} style={{width: '40%',display:'inline-block'}}/>
          )}
          <AddPopover
            name="添加类目"
            />
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

export default BookForm
