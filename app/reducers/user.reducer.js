import {USER_REQUEST, RECEIVE_SIGNUP_RES, RECEIVE_LOGIN_RES, RESET_REQ} from '../actions/user.action'

const initialState = {
  message: '',
  info: null,
  books: null,
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
    case "RECEIVE_SIGNUP_RES":
      return Object.assign({}, state, {
        message: action.res.message,
        info: action.res.user || null
      })
    case "RECEIVE_LOGIN_RES":
      return Object.assign({}, state, {
        message: action.res.message,
        info: action.res
      })
    default:
      return state
  }
}
