import {USER_REQUEST, RECEIVE_SIGNUP_RES, RECEIVE_LOGIN_RES, RECEIVE_MANAGECODE, RESET_REQ} from '../actions/user.action'

const initialState = {
  message: '',
  books: null,
  manage: 0
}

export default function name (state = initialState, action) {
  switch (action.type) {
    case "USER_REQUEST":
      return Object.assign({}, state, {
        message: ''
      })
    case "RESET_REQ":
      return Object.assign({}, state, {
        message: ''
      })
    case "RECEIVE_MANAGECODE":
      if (action.res.message) {
        return Object.assign({}, state, {
          message: action.res.message
        })
      } else {
        return Object.assign({}, state, {
          manage: action.res.manage
        })
      }
    case "RECEIVE_SIGNUP_RES":
    // 将token存入localstorage
      localStorage.setItem("token", action.res.token)
      localStorage.setItem("userName", action.res.name)
      return Object.assign({}, state, {
        message: action.res.message
      })
    case "RECEIVE_LOGIN_RES":
    // 将token存入localstorage
      localStorage.setItem("token", action.res.token)
      localStorage.setItem("userName", action.res.name)
      return Object.assign({}, state, {
        message: action.res.message
      })
    default:
      return state
  }
}
