import { receiveUsers, receiveLogRes, receiveUserMessage, receiveManagecode } from '../actions/user.action'

export const fetchData = (type, options) => (dispatch) => {
    switch (type) {
      case 'user':
        return fetch('/user/all')
          .then(res => res.json())
          .then(json => dispatch(receiveUsers(json)))
      case 'signup':
        return fetch('/user/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
         .then(res => res.json())
         .then(json => {
           dispatch(receiveLogRes(json))
           dispatch(receiveUserMessage(json))
         })
      case 'login':
        return fetch('/user/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => {
          dispatch(receiveLogRes(json))
          dispatch(receiveUserMessage(json))
        })
      case 'checkLogin':
        return fetch('/user/checklogin', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => {
          dispatch(receiveUserMessage(json))
        })
      case 'checkManage':
        return fetch('/user/checkmanage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => {
          dispatch(receiveUserMessage(json))
          dispatch(receiveManagecode(json))
        })
      case 'setManage':
        return fetch('/user/setmanage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveUserMessage(json)))
      case 'remove':
        return fetch('/user/remove', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveUserMessage(json)))
    }
}
