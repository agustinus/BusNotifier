import { combineReducers } from 'redux';
import ReduxBus from './Bus'

let Reducer = combineReducers({ bus: ReduxBus.Reducer });

export default {Reducer};