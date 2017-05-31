
import { receiveTypes, receiveTypeMessage } from '../actions/book.action'
const urls = {
  addtype: '/admin/type/new',
  removetype: '/admin/type/remove'
}
export const fetchData = (type, options) => (dispatch) => {
    switch (type) {
      case 'all':
        return fetch('/types')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveTypes(json))
          )
      default:
        return fetch(urls[type], {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => {
            dispatch(receiveTypeMessage(json))
          })

    }
}
