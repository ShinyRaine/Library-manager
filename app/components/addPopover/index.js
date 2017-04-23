import React from 'react'

import { Popover, Button, Select, Input } from 'antd'
const Option = Select.Option

class AddPopover extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      father: null
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
  submit() {
    this.setState({
      visible: false
    })
  }
  render() {
    console.log(111);
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
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option>
        </Select>
        <Input />
        <Button onClick={this.submit.bind(this)}>提交</Button>
      </div>
    )
    return (
      <Popover
        content={content}
        title={this.props.name}
        trigger="click"
        placement="right"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange.bind(this)}
      >
        <Button style={{marginLeft:'10px'}} type="primary">{this.props.name}</Button>
      </Popover>
    )
  }
}

export default AddPopover
