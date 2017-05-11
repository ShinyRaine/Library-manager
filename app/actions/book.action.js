import fetch from 'isomorphic-fetch'
import { fetchData } from '../api/bookApi'
import { fetchData as fetchType } from '../api/typeApi'
// 请求相关的Actions
export const RESET_BOOK_REQ = 'RESET_BOOK_REQ'
export function resetBookReq() {
  return {
    type: RESET_BOOK_REQ
  }
}
export const RECEIVE_BOOK_MESSAGE = 'RECEIVE_BOOK_MESSAGE'
export function receiveBookMessage(res) {
  return {
    type: RECEIVE_BOOK_MESSAGE,
    res
  }
}
export const RECEIVE_TYPE_MESSAGE = 'RECEIVE_TYPE_MESSAGE'
export function receiveTypeMessage(res) {
  return {
    type: RECEIVE_TYPE_MESSAGE,
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

export const RECEIVE_TYPES = 'RECEIVE_TYPES'
export function receiveTypes(json) {
  return {
    type: RECEIVE_TYPES,
    json
  }
}

export const FILTER_BOOK = 'FILTER_BOOK'
export function filterBook(text) {
  return {
    type: FILTER_BOOK,
    text
  }
}

export const BORROW_BOOK = 'BORROW_BOOK'
export function borrowBook(text) {
  return {
    type: BORROW_BOOK,
    text
  }
}

export const RETURN_BOOK = 'RETURN_BOOK'
export function returnBook(text) {
  return {
    type: RETURN_BOOK,
    text
  }
}

export const fetchBookData = fetchData
export const fetchTypeData = fetchType

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
