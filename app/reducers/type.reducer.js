import { RECEIVE_TYPES } from '../actions/book.action'

const initialState = {
  data: null
}

export default function type (state = initialState, action) {
  switch (action.type) {
      case "RECEIVE_TYPES":
        return Object.assign({}, state, {
          data: action.json
        })
    default:
      return state
  }
}
