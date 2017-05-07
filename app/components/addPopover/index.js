import React from 'react'

import { Popover, Button, Select, Input } from 'antd'
const Option = Select.Option

class AddPopover extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      father: '',
      value: ''
    }
  }
  showPop() {
    if (this.state.visible) {
      this.setState({
        visible: false
      })
    } else {
      this.setState({
        visible: true
      })
    }

  }
  handleVisibleChange(visible) {
    this.setState({
      visible: visible
    })
  }
  handleChange(value) {
    this.setState({
      father: value
    })
  }
  handleInput(event) {
    this.setState({
      value: event.target.value
    })
  }
  handleSubmit() {
    console.log(this.state);
    this.setState({
      visible: false
    })
    if (this.props.onSubmit) {
      this.props.onSubmit({
        father: this.state.father,
        name: this.state.value
      })
    }
  }
  render() {
    const proList = this.props.proList || []
    const content = (
      <div>
        <p>选择一个一级分类，若不选择则添加为一级分类</p>
        <Select
          showSearch
          style={{ width: 200 }}
          optionFilterProp="children"
          onChange={this.handleChange.bind(this)}
          filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input) >= 0}
        >
          { proList.map( (item) => {
            if (!item.father) {
              return (<Option key={item._id} value={item.name}>{item.name}</Option>)
            }
          }) }
        </Select>
        <Input style={{width: 200}} onChange={this.handleInput.bind(this)}/>
        <Button onClick={this.handleSubmit.bind(this)}>提交</Button>
      </div>
    )
    return (
      <Popover
        content={content}
        title={this.props.name}
        placement="right"
        trigger="click"
        visible={this.state.visible}
      >
        <Button
          style={{marginLeft:'10px'}}
          type="primary"
          onClick={this.showPop.bind(this)}
          >
          {this.props.name}
         </Button>
      </Popover>
    )
  }
}

export default AddPopover
