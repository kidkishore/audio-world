import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import P5Wrapper from 'react-p5-wrapper';
import p5 from 'p5';
import { setFrequencies, setSongObject, playPause } from '../../actions/effectActions';
import PlayButton from '../../components/PlayButton';

import { Button } from 'semantic-ui-react';

import 'p5/lib/addons/p5.sound';
//import mp3_file from '../../audio/hit.mp3';
import './AudioPlayer.css';
import '../../index.css';

class Player extends Component {

    playAudioFile = file => {
      var context = new window.AudioContext();
        context.decodeAudioData(file, function(buffer) {
          var source = context.createBufferSource();
            source.buffer = buffer;
            source.loop = false;
            source.connect(context.destination);
            source.start(0); 
        });
    };

 
    fileSelected = event => {
      this.props.playPause(false);
      var audio_file = event.target.files[0]
      this.props.setFrequencies([0,0,0,0,0]);

      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(audio_file);
      console.log('loading file reader...');
			fileReader.onload = function(e) {
				this.playAudioFile(e.target.result);
				console.log(("Filename: '" + audio_file.name + "'"), ( "(" + ((Math.floor(audio_file.size/1024/1024*100))/100) + " MB)" ));
			}
    }

/*
    shouldComponentUpdate(nextProps) {
        const differentVolume = this.props.volume !== nextProps.volume;
        const playedSong = this.props.playing !== nextProps.playing;
        return false;
    }

*/

    render() {
        // console.log("::: P5Wrapper.props:", this.props);


        return (
            <div className='soundControls'>
              <div className='centerAudioControls'>
                <div className='songUpload'>
                  <input type="file" onChange={this.fileSelected}/>
                </div>
                <PlayButton/>
              </div> 
            </div>  
        );
    }
}

const mapStateToProps = state => {
    return {
        bassControl: state.audio.ampControl[0],
        loMidControl: state.audio.ampControl[1],
        midControl: state.audio.ampControl[2],
        hiMidControl: state.audio.ampControl[3],
        trebleControl: state.audio.ampControl[4],
        volume: state.audio.volume,
        playing: state.audio.playing,
    };
};

export default connect(mapStateToProps, { setFrequencies, setSongObject, playPause })(Player);