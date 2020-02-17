import React, { Component } from 'react';
import FrequencyViz from './FrequencyViz';
import AmpControl from './AmpControl';
import './AmpControl.css';

class AudioMenu extends Component {
    render() {  
    return (
        <div>
          <FrequencyViz/>  
          <div className='on-mobile'>Please use a desktop or laptop to visualize music! Uploading audio files not supported on mobile devices.</div>
          <AmpControl/>
        </div>
      );
    }
}

export default AudioMenu;
