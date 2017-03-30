import fetch from 'isomorphic-fetch'

// 请求相关的Actions
export const USER_REQUEST = 'USER_REQUEST'
export function userRequest(type) {
  return {
    type: USER_REQUEST,
    type
  }
}

export const RESET_REQ = 'RESET_REQ'
export function resetReq() {
  return {
    type: RESET_REQ
  }
}

export const RECEIVE_SIGNUP_RES = 'RECEIVE_SIGNUP_RES'
export function receiveSignupRes(res) {
  return {
    type: RECEIVE_SIGNUP_RES,
    res
  }
}

export const RECEIVE_LOGIN_RES = 'RECEIVE_LOGIN_RES'
export function receiveLoginRes(res) {
  return {
    type: RECEIVE_LOGIN_RES,
    res
  }
}

export const RECEIVE_LOGOUT_RES = 'RECEIVE_LOGOUT_RES'
export function receiveLogoutRes(res) {
  return {
    type: RECEIVE_LOGOUT_RES,
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

export const CHECK_BEFORE_ADMIN = 'CHECK_BEFORE_ADMIN'
function checkBeforeAdmin(res) {
  return {
    type: CHECK_BEFORE_ADMIN,
    res
  }
}

export const fetchData = (type, options) => (dispatch) => {
    dispatch(userRequest(type))
    switch (type) {
      // 注册
      case 'signup':
        return fetch('/user/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
         .then(res => res.json())
         .then(json => dispatch(receiveSignupRes(json)))

      // 登录
      case 'login':
        return fetch('/user/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveLoginRes(json)))
        // 注销
      case 'logout':
        return fetch('/user/logout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveLogoutRes(json)))
      case 'checkManage':
        return fetch('/user/checkmanage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveManagecode(json)))
    }
}
