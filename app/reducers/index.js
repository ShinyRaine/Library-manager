import { combineReducers } from 'redux'
import name from './name.reducer'
import books from './books.reducer'

const reducer = combineReducers({
  books
})
export default reducer
