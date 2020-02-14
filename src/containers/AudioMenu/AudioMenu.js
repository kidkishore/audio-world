import React, { Component } from 'react';
import FrequencyViz from './FrequencyViz';
import AmpControl from './AmpControl';
import './AmpControl.css';

class AudioMenu extends Component {
    render() {  
    return (
        <div>
          <FrequencyViz/>  
          <div className='on-mobile'>Uploading audio files not support on mobile devices</div>
          <AmpControl/>
        </div>
      );
    }
}

export default AudioMenu;
