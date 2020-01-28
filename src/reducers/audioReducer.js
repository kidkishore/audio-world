////------------ HELPER REDUCER FUNCTIONS---------------////

function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues)
}

////------------ AUDIO REDUCER FUNCTIONS---------------////

export function audioReducer(audioState = [], action){
  switch (action.type) {
    case 'SETSONGOBJECT':
        return updateObject(audioState, { songObject: action.payload })
    case 'SETVOLUME':
        return updateObject(audioState, { volume: action.payload })
    case 'PLAYPAUSE':
        return updateObject(audioState, { playing: action.payload })
    case 'FREQUENCIES':
        return updateObject(audioState, { frequencies: action.payload })
    case 'AMPCONTROL':
        return updateObject(audioState, { ampControl: action.payload })
    default:
      return audioState
  }
}
