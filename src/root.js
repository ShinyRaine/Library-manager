import React from 'react'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

import { Index } from './pages/index'

let store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      	<Provider store={store}>
          <Index />
        </Provider>
    )
  }
}
export default Root
