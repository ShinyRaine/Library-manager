import React from 'react'
import './style.scss'

class FloatBtn extends React.Component {
  constructor(props){
    super(props)
  }
  render() {

    return (
      <div className="floatbtn" onClick={this.props.onClick}>
        {this.props.name}
      </div>
    )
  }
}

export default FloatBtn
