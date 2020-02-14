import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { setFrequencies, playPause } from '../../actions/effectActions';
import VideoRecorder from '../../components/VideoRecorder/VideoRecorder';
import './AudioPlayer.css';
import '../../index.css';
import 'babel-polyfill';
import $ from 'jquery';

export var audioStream;
export var analyser;

//<VideoRecorder />

class FilePlayer extends Component {

  constructor(props) {

    super(props);
    this.state = {
      trackPlaying: false
    };

  }
   
  fileSelected = event => {
    this.setState({songObject: event.target.files[0].name});
    this.props.playPause(false);
    var file = event.target.files[0]
    //console.log('the file: ', file);
    $("#srcElem").attr("src", URL.createObjectURL(file));
    document.getElementById("audioElem").load()
    //document.getElementById("audioElem").play()

    audioStream = document.getElementById("audioElem").captureStream();

    document.getElementById("audioElem").addEventListener("play", () => {
      this.props.playPause(true);
      this.analyseTracks();
    });
    document.getElementById("audioElem").addEventListener("pause", () => {
      this.props.playPause(false);
    });
    //console.log('the loaded stream: ', audioStream)
    this.props.setFrequencies([0,0,0,0,0]);
  }

  analyseTracks(){
  
    if(audioStream && audioStream.getAudioTracks()[0]){
      // create audio context
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser(); 
      var source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
      // Analyze the stream
      analyser.fftSize = 32;
    }
  }

  render() {
    return(
        <div className='fileControls'>
          <div className='songUpload'>
            <input type="file" className='songInput' onChange={this.fileSelected}/>
          </div>
          <audio id="audioElem" controls >
            <source src="" id="srcElem"/>
          </audio>
          <VideoRecorder />
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