import fetch from 'isomorphic-fetch'


export const ADD_NAME = 'ADD_NAME'
export function addName(text) {
  return {
    type: ADD_NAME,
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

export function fetchData(name) {

  return function (dispatch) {
    dispatch(requestData(name))

    return fetch('https://api.github.com/users/' + name)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveData(json))
      )
  }
}
