import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {
    Slider
} from '@material-ui/core';
import '../../index.css';
import './AmpControl.css';

import { setAmpControls } from '../../actions/effectActions';


class AmpControl extends Component {

    changeBass = (event, newValue) => { this.props.setAmpControls({...this.props.ampControl, bass: newValue, }); };
    
    changeLoMid = (event, newValue) => {  this.props.setAmpControls({...this.props.ampControl, loMid: newValue, }); };
    
    changeMid = (event, newValue) => { this.props.setAmpControls({...this.props.ampControl, mid: newValue, }); };
    
    changeHiMid = (event, newValue) => { this.props.setAmpControls({...this.props.ampControl, hiMid: newValue, }); };
    
    changeTreble = (event, newValue) => { this.props.setAmpControls({...this.props.ampControl, treble: newValue, }); };

    render () {

      const {bass, loMid, mid, hiMid, treble} = this.props.ampControl;

        return (
            <div className="ampControl">
                <div className="slider">
                    Bass
                    <Slider
                        value={bass} 
                        onChange={this.changeBass}
                        aria-labelledby="continuous-slider" 
                    />
                </div>
                <div className="slider">
                    loMid
                    <Slider
                        value={loMid} 
                        onChange={this.changeLoMid}
                        aria-labelledby="continuous-slider" 
                    />
                </div>
                <div className="slider">
                    Mid
                    <Slider
                        value={mid} 
                        onChange={this.changeMid}
                        aria-labelledby="continuous-slider" 
                    />
                </div>
                <div className="slider">
                    hiMid
                    <Slider
                        value={hiMid} 
                        onChange={this.changeHiMid}
                        aria-labelledby="continuous-slider" 
                    />
                </div>
                <div className="slider">
                    treble
                    <Slider
                        value={treble} 
                        onChange={this.changeTreble}
                        aria-labelledby="continuous-slider" 
                    />
                </div>
             </div>
        );
    }
    
}

AmpControl.propTypes = {
  ampControl: PropTypes.object.isRequired,
  setAmpControls: PropTypes.func
};

const mapStateToProps = state => {
    return {
      ampControl: state.audio.ampControl,
    };
};

const mapDispatch = (dispatch) => {
  return {
    setAmpControls: bindActionCreators(setAmpControls, dispatch)
  };
};

export default connect(mapStateToProps,mapDispatch)(AmpControl);