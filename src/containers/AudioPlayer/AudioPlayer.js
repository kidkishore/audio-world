import React, { Component } from "react";
import { Dropdown } from 'semantic-ui-react'
import MicPlayer from './MicPlayer.js';
import FilePlayer from './FilePlayer.js';
import DriverPlayer from './DriverPlayer.js';
import { streams } from '../../constants.js';
import './AudioPlayer.css';
import '../../index.css';

class AudioPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stream: 'DRIVER',
        };
    }

    streamSelected = (event, data) => { 
      this.setState({stream: data.value});
    }

    render() {
        return (
            <div className='soundControls'>
              <div className='audioDropdown'>
                Input Type:
                <Dropdown
                  floating
                  labeled
                  defaultValue={this.state.stream}
                  onChange={this.streamSelected}
                  options={streams}
                />
              </div>
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