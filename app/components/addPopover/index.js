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
  submit() {
    this.setState({
      visible: false
    })
  }
  render() {
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
        <Input style={{width: 200}}/>
        <Button onClick={this.submit.bind(this)}>提交</Button>
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
