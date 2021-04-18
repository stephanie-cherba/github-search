import {initialState} from '../state'

export const rootReducer = (state = initialState, action) => {
  switch(action.type){
    case 'SET_PAGE_NUMBER':
      return Object.assign({}, state, {
        page: action.payload
      })
    case 'SET_PER_PAGE_NUMBER':
      return Object.assign({}, state, {
        perPage: action.payload
      })
    case 'SET_QUERY':
      return Object.assign({}, state, {
        query: action.payload
      })
    case 'SET_SORT':
      return Object.assign({}, state, {
        sort: action.payload
      })
    case 'SET_SORT_ORDER':
      return Object.assign({}, state, {
        sortOrder: action.payload
      })
    case 'SET_SEARCH_RESULTS':
      return Object.assign({}, state, {
        searchResults: action.payload
      })
    case 'SET_ERROR':
      return Object.assign({}, state, {
        error: action.payload
      })
    default:
      return state
  }
}