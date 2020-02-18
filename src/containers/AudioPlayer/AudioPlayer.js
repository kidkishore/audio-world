import React, { Component } from "react";
//import { Dropdown } from 'semantic-ui-react'
import MicPlayer from './MicPlayer.js';
import FilePlayer from './FilePlayer.js'
import DriverPlayer from './DriverPlayer.js';
//import { streams } from '../../constants.js';
import './AudioPlayer.css';
import '../../index.css';

/*
  <div className='audioDropdown'>
    Input:
    <Dropdown
      className='innerDropdown'
      floating
      labeled
      defaultValue={this.state.stream}
      onChange={this.streamSelected}
      options={streams}
    />
  </div>
*/

class AudioPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stream: 'FILE',
        };
    }

    streamSelected = (event, data) => { 
      this.setState({stream: data.value});
    }

    render() {
        return (
            <div className='soundControls'>
                { this.state.stream == 'FILE' &&
                  <FilePlayer/>
                }
                {this.state.stream === 'MICROPHONE' &&
                  <MicPlayer/>
                }
                {this.state.stream === 'DRIVER' &&
                  <DriverPlayer/>
                }
            </div>  
        );
    }
}


export default AudioPlayer;