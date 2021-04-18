import {createStore} from 'redux'
import {rootReducer} from './effects/index'

export const store = createStore(rootReducer)
