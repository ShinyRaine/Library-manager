import {REQUEST_DATA, RECEIVE_BOOKS, RECEIVE_ADDBOOK_RES, RECEIVE_BOOK_INFO} from '../actions'

const initialState = {
  loadingData: false,
  data: null,
  receiveAddbookRes: '',
  info: null,
}

export default function books (state = initialState, action) {
  switch (action.type) {
      case "REQUEST_DATA":
        return Object.assign({}, state, {
          loading: true
        })
      case "RECEIVE_BOOKS":
        return Object.assign({}, state, {
          loadingData: false,
          data: action.json
        })
      case "RECEIVE_ADDBOOK_RES":
        return Object.assign({}, state, {
          receiveAddbookRes: action.res
        })
      case "RECEIVE_BOOK_INFO":
        return Object.assign({}, state, {
          info: action.res
        })
    default:
      return state
  }
}
