import { RESET_BOOK_REQ, RECEIVE_BOOK_MESSAGE, BOOK_REQUEST, RECEIVE_BOOKS, FILTER_BOOK} from '../actions/book.action'

const initialState = {
  resCode: '',
  message: '',
  loadingData: false,
  type: '',
  data: null,
  filtedata: null
}

export default function book (state = initialState, action) {
  switch (action.type) {
      case "RESET_BOOK_REQ":
        return Object.assign({}, state, {
          resCode: '',
          message: ''
        })
      case "RECEIVE_BOOK_MESSAGE":
        return Object.assign({}, state, {
          resCode: action.res.code || '',
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
      case "FILTER_BOOK":
      console.log(state.data)
        const filtedata = state.data.filter((item) => {
          return item.type.join('') === action.text.join('')
        })
        return Object.assign({}, state, {
          type: action.text,
          filtedata: filtedata
        })
    default:
      return state
  }
}
