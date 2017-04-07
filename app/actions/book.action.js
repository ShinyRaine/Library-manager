import fetch from 'isomorphic-fetch'


// 请求相关的Actions
export const RESET_BOOK_REQ = 'RESET_BOOK_REQ'
export function resetBookReq() {
  return {
    type: RESET_BOOK_REQ
  }
}
export const RECEIVE_BOOK_MESSAGE = 'RECEIVE_BOOK_MESSAGE'
function receiveBookMessage(res) {
  return {
    type: RECEIVE_BOOK_MESSAGE,
    res
  }
}
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

// export const RECEIVE_ADDBOOK_RES = 'RECEIVE_ADDBOOK_RES'
// export function receiveAddbookRes(res) {
//   return {
//     type: RECEIVE_ADDBOOK_RES,
//     res
//   }
// }

// export const RECEIVE_BOOK_INFO = 'RECEIVE_BOOK_INFO'
// export function receiveBookInfo(res) {
//   return {
//     type: RECEIVE_BOOK_INFO,
//     res
//   }
// }

export const fetchBookData = (type, options) => (dispatch) => {
    dispatch(bookRequest(type))
    switch (type) {
      case 'book':
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
