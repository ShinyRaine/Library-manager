import { combineReducers } from 'redux'
import user from './user.reducer'
import book from './book.reducer'

const reducer = combineReducers({
  book,
  user
})
export default reducer
