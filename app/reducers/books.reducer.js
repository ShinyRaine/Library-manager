import {REQUEST_DATA, RECEIVE_DATA} from '../actions'

const initialState = {
  loading: false,
  data: null
}

export default function books (state = initialState, action) {
  switch (action.type) {
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
