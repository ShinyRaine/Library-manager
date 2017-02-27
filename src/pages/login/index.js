import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions'
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import './style.scss'

class Login extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="infor">
      	hello
      </div>
    )
  }
}
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

export default connect(mapState, mapDispatch)(Root)
