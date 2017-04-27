import { RECEIVE_TYPES, RECEIVE_TYPE_MESSAGE } from '../actions/book.action'

const initialState = {
  resCode: '',
  resMessage: '',
  data: null
}

export default function type (state = initialState, action) {
  switch (action.type) {
      case "RECEIVE_TYPES":
        return Object.assign({}, state, {
          data: action.json
        })
      case "RECEIVE_TYPE_MESSAGE":
        return Object.assign({}, state, {
          resCode: action.res.code || '',
          resMessage: action.res.message || ''
        })
    default:
      return state
  }
}
