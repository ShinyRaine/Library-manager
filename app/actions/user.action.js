import fetch from 'isomorphic-fetch'

// 请求相关的Actions
export const RECEIVE_USERS = 'RECEIVE_USERS'
export function receiveUsers(res) {
  return {
    type: RECEIVE_USERS,
    res
  }
}

export const RESET_USER_REQ = 'RESET_USER_REQ'
export function resetUserReq() {
  return {
    type: RESET_USER_REQ
  }
}

export const RECEIVE_SIGNUP_RES = 'RECEIVE_SIGNUP_RES'
export function receiveSignupRes(res) {
  return {
    type: RECEIVE_SIGNUP_RES,
    res
  }
}

export const RECEIVE_LOG_RES = 'RECEIVE_LOG_RES'
export function receiveLogRes(res) {
  return {
    type: RECEIVE_LOG_RES,
    res
  }
}

export const RECEIVE_MANAGECODE = 'RECEIVE_MANAGECODE'
function receiveManagecode(res) {
  return {
    type: RECEIVE_MANAGECODE,
    res
  }
}

export const RECEIVE_USER_MESSAGE = 'RECEIVE_USER_MESSAGE'
function receiveMessage(res) {
  return {
    type: RECEIVE_USER_MESSAGE,
    res
  }
}

export const fetchUserData = (type, options) => (dispatch) => {
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
           dispatch(receiveMessage(json))
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
          dispatch(receiveMessage(json))
        })
      case 'checkManage':
        return fetch('/user/checkmanage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => {
          dispatch(receiveMessage(json))
          dispatch(receiveManagecode(json))
        })
      case 'setManage':
        return fetch('/user/setmanage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveMessage(json)))
      case 'remove':
        return fetch('/user/remove', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveMessage(json)))
    }
}
