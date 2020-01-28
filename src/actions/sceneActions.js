
/*
Takes in ID, name, response variable(treble, bass, etc.), and damping amount (Dividing 256 by amount to scale)
*/
export const addObject = (id, value, name, response, responseDamp) => dispatch => {
  dispatch({
      type: 'ADD_OBJECT',
      id: id,
      value: value,
      name: name,
      response: response,
      responseDamp: responseDamp
  });
};

export const deleteObject = id => dispatch => {
  dispatch({
      type: 'DELETE_OBJECT',
      id: id,
  });
};

export const editObject = (name, id) => dispatch => {
  dispatch({
      type: 'EDIT_OBJECT',
      name: name,
      id: id,
  });
};

export const changeScene = scene => dispatch => {
  dispatch({
      type: 'CHANGE_SCENE',
      payload: scene
  });
};

export const changeTransform = (newObject, id) => dispatch => {
  dispatch({
      type: 'CHANGE_TRANSFORM',
      newObject: newObject,
      id
  });
};

export const clearObjectsToRemove = () => dispatch => {
  dispatch({
      type: 'CLEAR_OTR'
  });
};

export const clearObjectsToEdit = () => dispatch => {
  dispatch({
      type: 'CLEAR_OTE'
  });
};

