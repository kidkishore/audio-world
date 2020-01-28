import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Slider
} from '@material-ui/core';
import { bindActionCreators } from 'redux';
import FrequencyViz from './FrequencyViz';
import AmpControl from './AmpControl/AmpControl';
import { setVolume } from '../actions/effectActions';
import './AmpControl/AmpControl.css';


class AudioMenu extends Component {

    state = {
        currentMenu: 'audio',
        visible: true,
        play: false,
        pad: null,
        volume: 50
    }

    handleChange = (event, newValue) => { this.props.setVolume(newValue); };

    render() {  
    return (
        <div>
          <FrequencyViz/>  
            <div className="volSlider">
                <i aria-hidden="true" className="grey volume up icon" align="left" ></i>
                <Slider
                    value={this.state.value}
                    color="primary"
                    onChange={this.handleChange}
                    defaultValue={50}
                    aria-labelledby="continuous-slider"
                />
            </div>
            <AmpControl/>
        </div>
      );
    }

}

AudioMenu.propTypes ={
  setVolume: PropTypes.func
}

const mapDispatch = (dispatch) => {
  return {
    setVolume: bindActionCreators(setVolume, dispatch)
  };
};

export default connect(null, mapDispatch)(AudioMenu);
