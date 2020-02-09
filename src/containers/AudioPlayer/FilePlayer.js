import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import P5Wrapper from 'react-p5-wrapper';
import PlayButton from '../../components/PlayButton';
import { setFrequencies, playPause } from '../../actions/effectActions';
import ReactAudioPlayer from 'react-audio-player';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './AudioPlayer.css';
import '../../index.css';
import axios from 'axios';
import 'babel-polyfill';
import $ from 'jquery';

export var audioStream;
export var analyser;



class FilePlayer extends Component {

  constructor(props) {

    super(props);
    this.state = {
      trackPlaying: false
    };

  }
   
  fileSelected = event => {
    this.props.playPause(false);
    this.setState({songObject: event.target.files[0].name});
    var file = event.target.files[0]
    console.log('the file: ', file);
    $("#srcElem").attr("src", URL.createObjectURL(file));
    document.getElementById("audioElem").load()
    document.getElementById("audioElem").play()

    audioStream = document.getElementById("audioElem").captureStream();
    console.log('the loaded stream: ', audioStream)
    this.props.setFrequencies([0,0,0,0,0]);
  }


  async onAudioClick(currentPlayer){
    await new Promise(r => setTimeout(r, 200));
    console.log('trying to handle play');  
    currentPlayer.analyseTracks();
  }

  analyseTracks(){
  
    if(audioStream && audioStream.getAudioTracks()[0]){
      // create audio context
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser(); 
      console.log('the analyzing stream: ', audioStream)
      var source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
  
      // Analyze the stream
      analyser.fftSize = 32;
      //this.interval = window.setInterval(this.printAudioData(analyser), 100)  
    }
  }

  render() {
    return(
        <div className='fileControls'>
          <div className='songUpload'>
            <input type="file" className='songInput' onChange={this.fileSelected}/>
          </div>
            <audio id="audioElem"
              onPlay={this.onAudioClick(this)}
              controls
            >
              <source src="" id="srcElem" />
            </audio>
        
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