import {USER_REQUEST, RECEIVE_MESSAGE, RECEIVE_LOG_RES, RECEIVE_MANAGECODE, RESET_REQ, RECEIVE_USERS} from '../actions/user.action'

const initialState = {
  message: '',
  books: null,
  manage: 0,
  users: null
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
      if(action.res.name === 'TokenExpiredError') {
        return Object.assign({}, state, {
          message: action.res.name
        })
      }
      return Object.assign({}, state, {
          manage: action.res.manage || 0
        })
    case "RECEIVE_LOG_RES":
      if (action.res.name) {
        setTokenStorage(action.res.name, action.res.token)
      }
    case "RECEIVE_USERS":
      return Object.assign({}, state, {
        users: action.res
      })
    default:
      return state
  }
}
function setTokenStorage (name, token) {
  localStorage.setItem("token", token)
  localStorage.setItem("userName", name)
}
