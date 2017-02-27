import {ADD_NAME, REQUEST_DATA, RECEIVE_DATA} from '../actions'

const initialState = {
  name: '',
  loading: false,
  data: null
}

export default function name (state = initialState, action) {
  switch (action.type) {
    case "ADD_NAME":
      return Object.assign({}, state, {
        name: action.text
      })
      case "REQUEST_DATA":
      return Object.assign({}, state, {
        loading: true
      })
      case "RECEIVE_DATA":
      return Object.assign({}, state, {
        loading: false,
        data: action.json
      })
    default:
      return state
  }
}
