import { receiveTypes, receiveTypeMessage } from '../actions/book.action'


export const fetchData = (type, options) => (dispatch) => {
    switch (type) {
      case 'all':
        return fetch('/types')
          .then(response => response.json())
          .then(json =>
            dispatch(receiveTypes(json))
          )
    // POST
      case 'addtype':
        return fetch('/admin/type/new', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(options)
         })
          .then(res => res.json())
          .then(json => {
            dispatch(receiveTypeMessage(json))
          })
      case 'removetype':
        return fetch('/admin/type/remove', {
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
