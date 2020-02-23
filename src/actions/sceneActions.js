import {
  getBackground,
  getCenter,
  getOrbit,
  getText
} from '../reducers/sceneHelper';
import { defaultColor } from '../constants'; 

//---------BACKGROUND ACTIONS---------//
export const addBackground = (name) => dispatch => {
  dispatch(getBackground({name, id: null, editing: false}));
};

export const editBackground = (name, id) => dispatch => {
  dispatch(getBackground({name, id, editing: true}));
};

export const updateBackground = (dispatch, payload) => {
  dispatch( {
      type: 'ADD_BACKGROUND_SUCCESS',
      payload
  });
}

//---------CENTER ACTIONS---------//
export const addCenter = (name, response, responseDamp) => dispatch => {
  dispatch(getCenter({
    name,
    id: null,
    response,
    responseDamp,
    editing: false
  }));
};

export const editCenter = (name, id, response, responseDamp) => dispatch => {
  dispatch(getCenter({
    name,
    id,
    response,
    responseDamp,
    editing: true
  }));
};

//triggered during model change
export const changeCenter = (payload) => {
  return {
      type: 'ADD_CENTER_SUCCESS',
      payload
  };
};

export const updateCenter = payload => dispatch => {
  dispatch({
      type: 'UPDATE_CENTER',
      payload
  });
};

//---------ORBIT ACTIONS---------//

export const addOrbit = (name, response, responseDamp) => dispatch => {
  dispatch(getOrbit({
    name,
    id: null,
    response,
    responseDamp,
    editing: false
  }));
};

export const editOrbit = (name, id, response, responseDamp) => dispatch => {
  dispatch(getOrbit({
    name,
    id,
    response,
    responseDamp,
    editing: true
  }));
};


export const changeOrbit = (payload) => {
  return {
      type: 'ADD_ORBIT_SUCCESS',
      payload
  };
};

export const updateOrbit = payload => dispatch => {
  dispatch({
      type: 'UPDATE_ORBIT',
      payload
  });
};

//---------Text ACTIONS---------//

export const addText = (data) => dispatch => {
  dispatch(getText({
    data,
    id: null,
    color: defaultColor,
    editing: false
  }));
};

export const editText = (data, id, color) => dispatch => {
  dispatch(getText({
    data,
    id,
    color,
    editing: true
  }));
};


export const updateText = (dispatch, payload) => {
  dispatch( {
      type: 'ADD_TEXT_SUCCESS',
      payload
  });
}
