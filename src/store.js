import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

//loop through object state
/*
Object.entries(obj).forEach(
  ([key, value]) => console.log(key, value)
);*/

//SCENE UPDATE
const initialState = {
  audio:{
    songObject: false,
    volume: 50,
    playing: false,
    frequencies: [0,0,0,0,0],
    ampControl: {
      bass:50,
      loMid: 50,
      mid: 50,
      hiMid:50,
      treble: 50 
    }
  },
  scene: {
    timestamp: 0
  }
}


const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
      compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
  ),
);

export default store;