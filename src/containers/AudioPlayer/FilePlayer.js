import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import P5Wrapper from 'react-p5-wrapper';
import PlayButton from '../../components/PlayButton';
import { setFrequencies, playPause } from '../../actions/effectActions';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './AudioPlayer.css';
import '../../index.css';

class FilePlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
        songObject: null
    };

    this.sketch = this.sketch.bind(this);
  }

   
  fileSelected = event => {
    this.props.playPause(false);
    this.setState({songObject: event.target.files[0]});
    this.props.setFrequencies([0,0,0,0,0]);
  }


    sketch(p) {

      var song;
      var localSongObject = null;
      var fft;
      var bands = 128;
      var bassFreq, loMidFreq, midFreq, hiMidFreq, trebleFreq;
      var audioGrab;


      let fr = 60;

      p.setup = () => {
          p.frameRate(fr);
      };

      
      p.draw = () => {

        //if song exists
        if(song){
          if(!song.isPlaying() && this.props.playing){  //if song isnt playing and should start
            song.play();
            //console.log('playing, play status: ', this.props.playing);
          }else if(song.isPlaying() && !this.props.playing){ //if song is playing and should stop
              this.props.setFrequencies([0,0,0,0,0]);
              song.stop();
          }else if(fft && this.props.playing){

            fft.analyze();
            const {bass, loMid, mid, hiMid, treble} = this.props.ampControl;
            
            bassFreq = fft.getEnergy('bass')-50 + bass;
            loMidFreq = fft.getEnergy('lowMid')-50 + loMid;
            midFreq = fft.getEnergy('mid')-50 + mid;
            hiMidFreq = fft.getEnergy('highMid') + hiMid;
            trebleFreq = fft.getEnergy('treble') + treble;

            song.setVolume(this.props.volume/100.0);

            this.props.setFrequencies([bassFreq, loMidFreq, midFreq, hiMidFreq, trebleFreq]);

          }
        }
          //If audio file exists, this runs once
          if(localSongObject != this.state.songObject){

            if(song){
              song.stop();
              this.props.playPause(false);
            song = null;
            }
            localSongObject = this.state.songObject;

            //console.log('stoping and loading song in p5');
            
            p.loadSound(localSongObject, (newSong) => {
              fft = new p5.FFT(0.9, bands);
              fft.setInput(audioGrab);
              song = newSong;
              //console.log('New song has been loaded');
            });
                    
            
          } 

      };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return(
        <div className='fileControls'>
          <div className='songUpload'>
            <input type="file" onChange={this.fileSelected}/>
          </div>
          <PlayButton/>
          <div className='sketchCanvas'>
            <P5Wrapper
              sketch={this.sketch.bind(this)}>
            </P5Wrapper>
          </div>
        </div>
    );
  }
}

FilePlayer.propTypes = {
  setFrequencies: PropTypes.func,
  playPause: PropTypes.func,
  playing: PropTypes.bool,
  ampControl: PropTypes.object,
  volume: PropTypes.number

}

const mapStateToProps = state => {
  return {
    playing: state.audio.playing,
    volume: state.audio.volume,
    ampControl: state.audio.ampControl
  };
};

const mapDispatch = (dispatch) => {
  return {
    setFrequencies: bindActionCreators(setFrequencies, dispatch),
    playPause: bindActionCreators(playPause, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatch)(FilePlayer);