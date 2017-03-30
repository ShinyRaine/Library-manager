import {USER_REQUEST, RECEIVE_MESSAGE, RECEIVE_LOG_RES, RECEIVE_MANAGECODE, RESET_REQ} from '../actions/user.action'

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
    case "RECEIVE_MESSAGE":
      return Object.assign({}, state, {
        message: action.res.message || ''
      })
    case "RECEIVE_MANAGECODE":
        return Object.assign({}, state, {
          manage: action.res.manage || 0
        })
    case "RECEIVE_LOG_RES":
      setTokenStorage(action.res.name, action.res.token)
    default:
      return state
  }
}
function setTokenStorage (name, token) {
  localStorage.setItem("token", token)
  localStorage.setItem("userName", name)
}
