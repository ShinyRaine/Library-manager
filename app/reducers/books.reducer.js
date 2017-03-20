import {ADD_BOOK, BOOK_REQUEST, RECEIVE_BOOKS, RECEIVE_ADDBOOK_RES, fetchBookData} from '../actions/book.action'

const initialState = {
  loadingData: false,
  data: null,
  addBookInfo: null,
  receiveAddbookRes: null,
}

export default function books (state = initialState, action) {
  switch (action.type) {
      case "ADD_BOOK":
        return Object.assign({}, state, {
          addBookInfo: action.info
        })
      case "BOOK_REQUEST":
        return Object.assign({}, state, {
          loadingData: true
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
