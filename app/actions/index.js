import fetch from 'isomorphic-fetch'

export const ADD_BOOK = 'ADD_BOOK'
export function addBook(text) {
  return {
    type: ADD_BOOK,
    text
  }
}

export const REQUEST_DATA = 'REQUEST_DATA'
export function requestData(data) {
  return {
    type: REQUEST_DATA,
    data
  }
}

export const RECEIVE_DATA = 'RECEIVE_DATA'
export function receiveData(json) {
  return {
    type: RECEIVE_DATA,
    json
  }
}

export const fetchData = (type, options) => (dispatch) => {
    dispatch(requestData(type))
    switch (type) {
      case 'books':
        return fetch('/books')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveData(json))
          )
        break;
    // POST
      case 'addbook':
        return fetch('/admin/books/new', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(response => response.json())
          .then(json =>
            dispatch(receiveData(json))
          )
        break;
    }
}
