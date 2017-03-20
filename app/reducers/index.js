import { combineReducers } from 'redux'
import user from './user.reducer'
import books from './books.reducer'

const reducer = combineReducers({
  books,
  user
})
export default reducer
