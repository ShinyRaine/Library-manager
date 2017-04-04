import { RESET_BOOK_REQ, RECEIVE_BOOK_MESSAGE, BOOK_REQUEST, RECEIVE_BOOKS, RECEIVE_ADDBOOK_RES} from '../actions/book.action'

const initialState = {
  message: '',
  loadingData: false,
  data: null,
  receiveAddbookRes: null
}

export default function book (state = initialState, action) {
  switch (action.type) {
      case "RESET_BOOK_REQ":
        return Object.assign({}, state, {
          message: ''
        })
      case "RECEIVE_BOOK_MESSAGE":
        return Object.assign({}, state, {
          message: action.res.message || ''
        })
      case "BOOK_REQUEST":
        return Object.assign({}, state, {
          loadingData: true
        })
      case "RECEIVE_BOOKS":
        const data = action.json
        if (data) {
          data.map((item) => Object.assign(item, {key: item._id}))
        }
        return Object.assign({}, state, {
          loadingData: false,
          data: data
        })
      case "RECEIVE_ADDBOOK_RES":
        return Object.assign({}, state, {
          receiveAddbookRes: action.res
        })
    default:
      return state
  }
}
