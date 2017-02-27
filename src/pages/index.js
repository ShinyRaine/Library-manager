import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions'


import './style.scss'

class Index extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="infor">
      	abcdxxx
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

export default connect(mapState, mapDispatch)(Index)
