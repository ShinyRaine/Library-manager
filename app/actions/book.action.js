import fetch from 'isomorphic-fetch'

export const ADD_BOOK = 'ADD_BOOK'
export function addBook(info) {
  return {
    type: ADD_BOOK,
    info
  }
}

// 请求相关的Actions
export const BOOK_REQUEST = 'BOOK_REQUEST'
export function bookRequest(data) {
  return {
    type: BOOK_REQUEST,
    data
  }
}

export const RECEIVE_BOOKS = 'RECEIVE_BOOKS'
export function receiveBooks(json) {
  return {
    type: RECEIVE_BOOKS,
    json
  }
}

export const RECEIVE_ADDBOOK_RES = 'RECEIVE_ADDBOOK_RES'
export function receiveAddbookRes(res) {
  return {
    type: RECEIVE_ADDBOOK_RES,
    res
  }
}

export const fetchBookData = (type, options) => (dispatch) => {
    dispatch(bookRequest(type))
    switch (type) {
      case 'books':
        return fetch('/books')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveBooks(json))
          )
    // POST
      case 'addbook':
        return fetch('/admin/books/new', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => dispatch(receiveAddbookRes(json)))
    }
}
