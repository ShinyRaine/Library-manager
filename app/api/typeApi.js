import { receiveTypes } from '../actions/book.action'


export const fetchData = (type, options) => (dispatch) => {
    switch (type) {
      case 'all':
        return fetch('/types')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveTypes(json))
          )
    // POST
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
    }
}
