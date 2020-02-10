import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import P5Wrapper from 'react-p5-wrapper';
import { setFrequencies } from '../../actions/effectActions';
import p5 from 'p5';
import './AudioPlayer.css';
import '../../index.css';

class DriverPlayer extends Component {

  constructor(props) {
    super(props);
    this.sketch = this.sketch.bind(this);
    this.width = 350;
  }


  sketch(p) {

    var fft;
    var bands = 128;
    var bassFreq, loMidFreq, midFreq, hiMidFreq, trebleFreq;
    var audioGrab;


    let fr = 60;

    //audioGrab and fft get set
    p.setup = () => {

      

      audioGrab = new p5.AudioIn();

      audioGrab.getSources(function(deviceList) {
          //console.log(deviceList);
          //print out the array of available sources
          for(var i = 0; i < deviceList.length; i++)
          {
            //console.log(deviceList[i].label);
              if(deviceList[i].label.endsWith("(VB-Audio Virtual Cable)")){
              //if(deviceList[i].label.endsWith("(Realtek Audio)")){
                  //console.log('cable found at ', i);
                  audioGrab.setSource(i);
                  //audioGrab.connect();
                  audioGrab.start();
                  fft = new p5.FFT(0.9, bands);
                  fft.setInput(audioGrab);
              }

          }
          //set the source to the first item in the deviceList array
          
        });

        p.frameRate(fr);


       
    };

    
    p.draw = () => {

      if(fft){

        fft.analyze();
        const {bass, loMid, mid, hiMid, treble} = this.props.ampControl;
        
        bassFreq = fft.getEnergy('bass') + 100 + bass;
        loMidFreq = fft.getEnergy('lowMid') + 100 + loMid;
        midFreq = fft.getEnergy('mid') + 100 + mid;
        hiMidFreq = fft.getEnergy('highMid') + 100 + hiMid;
        trebleFreq = fft.getEnergy('treble') + 100 + treble;

        this.props.setFrequencies([bassFreq, loMidFreq, midFreq, hiMidFreq, trebleFreq]);
      }

    };

    p.touchStarted = () => {
      p.getAudioContext().resume()
    }
}

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return(
      <div className='fileControls'>
        <button className="startButton">
          Start Capturing Driver
        </button>
        <div className='sketchCanvas'>
          <P5Wrapper
            sketch={this.sketch.bind(this)}>
          </P5Wrapper>
        </div>
      </div>
    );
  }
}

DriverPlayer.propTypes = {
  setFrequencies: PropTypes.func,
  ampControl: PropTypes.object
}

const mapStateToProps = state => {
  return {
    ampControl: state.audio.ampControl
  };
};

const mapDispatch = (dispatch) => {
  return {
    setFrequencies: bindActionCreators(setFrequencies, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatch)(DriverPlayer);