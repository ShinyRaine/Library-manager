import 'antd/dist/antd.css'

import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './src/reducers'

import Index  from './src/pages/index'

let store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

let render = (Component) => {
  <AppContainer>
    <Provider store={store}>
    <Component />
    </Provider>
  </AppContainer>
,
  document.getElementById('root')
}
render(Index)
if (module.hot) {
  module.hot.accept('./src/pages/index', () => {
    render(Index)
  })
}
