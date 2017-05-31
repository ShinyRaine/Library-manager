import { Promise } from 'es6-promise'
window.Promise = Promise

import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

import { Router, Route, browserHistory } from 'react-router'


import LoginForm  from './container/login'
import Root  from './container/root'
import User  from './container/user'
import Admin  from './container/admin'
import SignupForm from './container/signup'

let store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))
function getLogState () {
    let token = localStorage.token
    if (!token) {
      browserHistory.push('/login')
    }
}

let render = (Component) => {
   ReactDom.render(
     <AppContainer>
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Root} />
          <Route path="/login" component={LoginForm} />
          <Route path="/user" component={User} onEnter={getLogState}/>
          <Route path="/signup" component={SignupForm} />
          <Route path="/admin" component={Admin} onEnter={getLogState}/>
        </Router>
      </Provider>
     </AppContainer>,
     document.getElementById('root')
   )
}
render(Root)
if (module.hot) {
  module.hot.accept('./container/root', () => {
    render(Root)
  })
}
