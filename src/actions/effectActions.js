

// SCENE ACTIONS
export const update = (timestamp) => dispatch => {

    //console.log('dispatching');

    dispatch({
        type: 'UPDATE',
        payload: timestamp
    });
};

export const setCenter = (objectType, item) => dispatch => {

  dispatch({
      type: 'SETCENTER',
      objectType: objectType,
      payload: item
  });
};

//AUDIO ACTIONS
export const setFrequencies = (frequencies) => dispatch => {

    dispatch({
        type: 'FREQUENCIES',
        payload: frequencies
    });
};



export const setAmpControls = (ampcontrols) => dispatch => {

    dispatch({
        type: 'AMPCONTROL',
        payload: ampcontrols
    });
};

export const setVolume = (vol) => dispatch => {

  dispatch({
      type: 'SETVOLUME',
      payload: vol
  });
};



export const playPause = (item) => dispatch => {

  dispatch({
      type: 'PLAYPAUSE',
      payload: item
  });
};

export const setSongObject = (songObject) => dispatch => {

  dispatch({
      type: 'SETSONGOBJECT',
      payload: songObject
  });
};




