import { sceneDetail } from '../constants';

////------------ HELPER REDUCER FUNCTIONS---------------////

function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues)
}

/*
function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {// Since we only want to update one item, preserve all others as they are now
      return item
    }
    const updatedItem = updateItemCallback(item)    // Use the provided callback to create an updated item
    return updatedItem
  })
  return updatedItems
}*/

////------------ SCENE REDUCER FUNCTIONS---------------////

//Change the scene by replacing all objects in the scene
const changeScene = (sceneState, action) => {
  //const newState = {};
  //newState.name = action.name;
  //newState.objects = {...action.objects};
  //console.log("changing scene to: ", action.payload);
  //console.log(sceneDetail);
  
  const newState = {...sceneState};

  if(sceneState.name != action.payload){

    newState.name = action.payload;

    sceneState.objects.forEach(object => {


      switch(object.name){
        case 'Center':
            newState.objectsToEdit.push({
              id: object.id,
              file: sceneDetail[action.payload].Center
            });
          break
        case 'Orbit':            
          newState.objectsToEdit.push({
            id: object.id,
            file: sceneDetail[action.payload].Orbit
          });
          break
        case 'Background':            
          newState.objectsToEdit.push({
            id: object.id,
            file: sceneDetail[action.payload].Background
          });
          break

      }

        
    })
  }

  

  return newState;

}


//update the old timestamp and default changing properties (rotation)
const updatePosition = (sceneState, newTimestamp) => {
  const newState = {...sceneState};
  newState.timestamp = newTimestamp;

  return newState;

};

//Create a new object with corresponding properties
const addObject = (sceneState, action) => {
  const newObjects = sceneState.objects.concat({
    id: action.id,
    value: action.value,
    name: action.name,
    response: action.response,
    responseDamp: action.responseDamp,
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    rotXAmt: 0.005,
    rotYAmt: 0.005,
    scale: 1
  })
  return updateObject(sceneState, {objects: newObjects});
};


//deleteobject from Objects array
const deleteObject = (sceneState, action) => {

  const newState = {...sceneState};
  let newObjects = []

  sceneState.objects.forEach(object => {
    if (object.id !== action.id) // return all objects, but drop the one we're deleting
      newObjects.push(object);
    else
      newState.objectsToRemove.push(action.id); //stage item to delete
  })

  return updateObject(newState, {objects: newObjects} );

};

//edit object from Objects array
const editObject = (sceneState, action) => {

  const newState = {...sceneState};

  sceneState.objects.forEach(object => {
    if (object.id === action.id) // return all objects, but edit the one we want
      newState.objectsToEdit.push({
        id: action.id,
        name: action.name,
        file: action.name + '.glb',
      });
  })

  return newState;

};

//edit object freq from Objects array
const editObjectFreq = (sceneState, action) => {

  const newState = {...sceneState};
  let newObjects = []

  sceneState.objects.forEach(object => {
    if (object.id !== action.id) // return all objects, but drop the one we're deleting
      newObjects.push(object);
    else
      newObjects.push(updateObject(object, {response: action.response, responseDamp: action.responseDamp }));
  })
  return updateObject(newState, {objects: newObjects} );
};

//deleteobject from Objects array
const changeTransform = (sceneState, action) => {

  const newState = {...sceneState};
  let newObjects = []

  sceneState.objects.forEach(oldObject => {
    if (oldObject.id === action.id){ // return all objects, but drop the one we're deleting
      newObjects.push(action.newObject);
    }
    else
      newObjects.push(oldObject);
  })

  return updateObject(newState, {objects: newObjects} );

}


export function sceneReducer (sceneState = [], action){
  switch (action.type) {
    case 'CHANGE_SCENE':
        return changeScene(sceneState, action)
    case 'UPDATE':
        return updatePosition(sceneState, action.payload)
    case 'ADD_OBJECT':
        return addObject(sceneState, action)
    case 'DELETE_OBJECT':
        return deleteObject(sceneState, action)
    case 'EDIT_OBJECT':
        return editObject(sceneState, action)
    case 'EDIT_OBJECT_FREQ':
        return editObjectFreq(sceneState, action)
    case 'CHANGE_TRANSFORM':
      return changeTransform(sceneState, action)
    case 'CLEAR_OTR':
        return updateObject(sceneState, {objectsToRemove: []});
      case 'CLEAR_OTE':
        return updateObject(sceneState, {objectsToEdit: []});
    default:
      return sceneState
  }
}
