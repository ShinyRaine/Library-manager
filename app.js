import 'antd/dist/antd.css'

import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './src/reducers'

import Root  from './src/pages/root'

let store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

let render = (Component) => {
   ReactDom.render(
     <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
     </AppContainer>,
     document.getElementById('root')
)
}
render(Root)
if (module.hot) {
  module.hot.accept('./src/pages/root', () => {
    render(Root)
  })
}