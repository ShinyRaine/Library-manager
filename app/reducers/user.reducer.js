import {USER_REQUEST, RECEIVE_SIGNUP_RES, RECEIVE_LOGIN_RES} from '../actions/user.action'

const initialState = {
  loading: false,
  name: '',
  manage: 0,
  books: null
}

export default function name (state = initialState, action) {
  switch (action.type) {
    case "USER_REQUEST":
      return Object.assign({}, state, {
        loading: true
      })
      case "RECEIVE_SIGNUP_RES":
      return Object.assign({}, state, {
        loading: true
      })
      case "RECEIVE_LOGIN_RES":
      return Object.assign({}, state, {
        loading: false,
        data: action.json
      })
    default:
      return state
  }
}
