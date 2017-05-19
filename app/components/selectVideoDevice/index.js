import React from 'react'
import { Select } from 'antd'

class SelectDevice extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      devices: [],
      deviceId: 0
    }
  }
  componentDidMount() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.setState({devices: devices.filter(info => info.kind === 'videoinput')})
    })
  }
  selectDevice(value) {
    this.setState({deviceId: value})
    this.props.onChange(value)
  }
  render() {
    return (
      <div style={{display: "inline-block"}}>
        <span>选择扫码设备</span>
        <Select style={{ width: 120 }} onChange={this.selectDevice.bind(this)}>
          {
              this.state.devices.map(videoDevice => ([
                <Select.Option value={videoDevice.deviceId}>{videoDevice.label}</Select.Option>
              ]))
          }
        </Select>
      </div>
    )
  }
}

export default SelectDevice
