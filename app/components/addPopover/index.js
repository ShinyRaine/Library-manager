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
  selectItem(value) {
    this.setState({
      value: value
    })
  }
  handleCancel() {
    this.setState({
      visible: false
    })
  }
  handleSubmit() {
    this.setState({
      visible: false
    })
    if (this.props.onSubmit) {
      if (this.props.name === "添加类目" || this.state.value) {
        this.props.onSubmit({
          father: this.state.father,
          name: this.state.value
        })
      } else {
        this.props.onSubmit({
          father: '',
          name: this.state.father
        })
      }
    }
  }
  render() {
    const proList = this.props.proList || []
    const content = (
      <div>
        {this.props.name === "添加类目" ? <p>选择一个一级分类，若不选择则添加为一级分类</p> : null}
        <Select
          showSearch
          style={{ width: 100 }}
          optionFilterProp="children"
          onChange={this.handleChange.bind(this)}
          filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input) >= 0}
        >
          { proList.filter((item)=>{
              if (!item.father) {
                return true
              }
            }).map( (item) => <Option key={item._id} value={item.name}>{item.name}</Option>)
          }
        </Select>
        {this.props.name === "添加类目" ? <Input style={{width: 100}} onChange={this.handleInput.bind(this)}/> :
          <Select
            showSearch
            style={{ width: 100 }}
            optionFilterProp="children"
            onChange={this.selectItem.bind(this)}
            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input) >= 0}
          >
            { proList.filter((item)=>{
                if (item.father && item.father === this.state.father) {
                  return true
                }
              }).map( (item) => <Option key={item._id} value={item.name}>{item.name}</Option>)
            }
          </Select>
        }
        <div>
        <Button onClick={this.handleSubmit.bind(this)} type="primary">提交</Button>
        <Button onClick={this.handleCancel.bind(this)}>取消</Button>
        </div>
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
          onClick={this.showPop.bind(this)}
          >
          {this.props.name}
         </Button>
      </Popover>
    )
  }
}

export default AddPopover
