import {BOOK_REQUEST, RECEIVE_BOOKS, RECEIVE_ADDBOOK_RES} from '../actions/book.action'

const initialState = {
  loadingData: false,
  data: null,
  receiveAddbookRes: '',
  info: null,
}

export default function books (state = initialState, action) {
  switch (action.type) {
      case "BOOK_REQUEST":
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
    default:
      return state
  }
}
