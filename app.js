import 'antd/dist/antd.css'

import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './src/reducers'

import { Router, Route, browserHistory } from 'react-router'


import LoginForm  from './src/pages/login'
import Root  from './src/pages/root'
import User  from './src/pages/user'
import Admin  from './src/pages/admin'
import SignupForm from './src/pages/signup'

let store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

let render = (Component) => {
   ReactDom.render(
     <AppContainer>
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Root} />
          <Route path="/login" component={LoginForm} />
          <Route path="/user" component={User} />
          <Route path="/signup" component={SignupForm} />
          <Route path="/admin" component={Admin} />
        </Router>
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
