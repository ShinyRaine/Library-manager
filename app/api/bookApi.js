import { bookRequest, receiveBooks, receiveBookMessage, receiveSearchRes } from '../actions/book.action'
const urls = {
  book : '/books',
  addbook : '/admin/books/new',
  edit : '/admin/books/edit',
  remove : '/admin/books/remove',
  borrow : '/books/borrow',
  return : '/books/return'
}
export const fetchData = (type, options) => (dispatch) => {
    dispatch(bookRequest(type))
    switch (type) {
      case 'book':
        return fetch('/books')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveBooks(json))
          )
      case 'search':
        return fetch('/books/search',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => {
            dispatch(receiveSearchRes(json))
          })
      default:
        return fetch(urls[type], {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => {
            dispatch(receiveBookMessage(json))
          })
    }
}
