import { sceneDetail } from '../constants';
import {
  importBackground,
  importCenter,
  importOrbit
} from './sceneHelper';

////------------ HELPER REDUCER FUNCTIONS---------------////

function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues)
}

//update the old timestamp and default changing properties (rotation)
const updatePosition = (sceneState, newTimestamp) => {
  const newState = {...sceneState};
  newState.timestamp = newTimestamp;

  return newState;

};

export function sceneReducer (sceneState = [], action){
  switch (action.type) {
    case 'ADD_BACKGROUND_SUCCESS':
      return updateObject(sceneState, {background: action.payload} )
    case 'ADD_CENTER_SUCCESS':
      return updateObject(sceneState, {center: action.payload} )
    case 'ADD_ORBIT_SUCCESS':
      return updateObject(sceneState, {orbit: action.payload} )
    case 'ADD_TEXT_SUCCESS':
      return updateObject(sceneState, {text: action.payload} )
    case 'UPDATE_CENTER':
      return updateObject(sceneState, {center: action.payload} )
    case 'UPDATE_ORBIT':
      return updateObject(sceneState, {orbit: action.payload} )
    case 'UPDATE':
        return updatePosition(sceneState, action.payload)
    default:
      return sceneState
  }
}
