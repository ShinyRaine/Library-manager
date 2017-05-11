import { bookRequest, receiveBooks, receiveBookMessage } from '../actions/book.action'

export const fetchData = (type, options) => (dispatch) => {
    dispatch(bookRequest(type))
    switch (type) {
      case 'book':
        return fetch('/books')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveBooks(json))
          )
      case 'addbook':
        return fetch('/admin/books/new', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => {
            dispatch(receiveBookMessage(json))
          })
      case 'edit':
        return fetch('/admin/books/edit', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => dispatch(receiveBookMessage(json)))
      case 'remove':
        return fetch('/admin/books/remove', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveBookMessage(json)))
      case 'borrow':
        return fetch('/books/borrow', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveBookMessage(json)))
      case 'return':
        return fetch('/books/return', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(json => dispatch(receiveBookMessage(json)))
    }
}
