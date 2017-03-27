import {USER_REQUEST, RECEIVE_SIGNUP_RES, RECEIVE_LOGIN_RES, RESET_REQ} from '../actions/user.action'

const initialState = {
  message: '',
  name: '',
  token: '',
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
    // 将token存入localstorage
      return Object.assign({}, state, {
        message: action.res.message,
        name: action.res.name,
        token: action.res.token
      })
    case "RECEIVE_LOGIN_RES":
    // 将token存入localstorage
      return Object.assign({}, state, {
        message: action.res.message,
        name: action.res.name,
        token: action.res.token
      })
    default:
      return state
  }
}
