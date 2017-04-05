import React from 'react'
import { browserHistory } from 'react-router'
import { Modal } from 'antd'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item
import { Link } from 'react-router'
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
      reject('time out')
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
  componentWillReceiveProps(nextProps) {
    const { data, type } = nextProps
    const nowBook = this.props.data || ''
    if (data && type === 'edit' && data.isbn !== nowBook.isbn) {
      console.log(nowBook.isbn, data);
      this.setForm(data)
      this.setState({
        loadedInfo: true
      })
    }
  }
  resetForm() {
    const form = this.props.form
    form.setFieldsValue({
      isbn: '',
      title: '',
      author: '',
      translator: '',
      description: ''
    })
    this.setState({
      title: '',
      loading: false,
      loadedInfo: false
    })
  }
  setForm(info) {
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
        this.setState({
          title: '图书信息',
          loadedInfo: true,
          loading: false
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      Modal.error({
        title: '请输入正确的Isbn'
      })
    }
  }
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.props.onSubmit) {
            this.props.onSubmit(this.props.type, values)
            this.resetForm()
          }
        }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const title = this.state.title || this.props.title
    const infoItem = (
      <div>
        <FormItem
          label="书名"
          >
          {getFieldDecorator('title')(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="作者"
          >
          {getFieldDecorator('author')(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="译者"
          >
          {getFieldDecorator('translator')(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="出版日期"
          >
          {getFieldDecorator('publishTime')(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="简介"
          >
          {getFieldDecorator('description')(
            <textarea style={{width: '100%'}}></textarea>
          )}
        </FormItem>
        <FormItem
          label="封面"
          >
          {getFieldDecorator('pic')(
            <Input />
          )}
        </FormItem>
        <FormItem
          >
          {getFieldDecorator('edit')(
            <Input disabled display='none'/>
          )}
        </FormItem>
      </div>
    )
    return (
      <Modal
        title={title}
        visible={this.props.visible}
        onOk={this.handleSubmit.bind(this)}
        onCancel={this.onCancel.bind(this)}
        confirmLoading={this.state.loadedInfo}
        footer={this.state.loadedInfo ? [
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleSubmit.bind(this)}>
            提交
          </Button>,
        ] : null}
        >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem
            label="isbn"
            >
            {getFieldDecorator('isbn')(
              <Input />
            )}
            <Button onClick={this.handleInput.bind(this)}>确认</Button>
          </FormItem>
          {this.state.loadedInfo ? infoItem : null}
        </Form>
      </Modal>
    )
  }
}
const BookForm = Form.create()(bookModal)

export default BookForm
