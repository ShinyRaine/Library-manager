import { combineReducers } from 'redux'
import user from './user.reducer'
import book from './book.reducer'
import type from './type.reducer'

const reducer = combineReducers({
  book,
  user,
  type
})
export default reducer
