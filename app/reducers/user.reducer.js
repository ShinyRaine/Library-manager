import { RECEIVE_USER_MESSAGE, RECEIVE_LOG_RES, RECEIVE_MANAGECODE, RESET_USER_REQ, RECEIVE_USERS} from '../actions/user.action'

const initialState = {
  resCode: '',
  message: '',
  books: null,
  manage: 0,
  users: null
}

export default function name (state = initialState, action) {
  switch (action.type) {
    case "RESET_USER_REQ":
      return Object.assign({}, state, {
        resCode: '',
        message: ''
      })
    case "RECEIVE_USER_MESSAGE":
      return Object.assign({}, state, {
        resCode: action.res.code || '',
        message: action.res.message || ''
      })
    case "RECEIVE_MANAGECODE":
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
