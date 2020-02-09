import React, { Component } from 'react';
import FrequencyViz from './FrequencyViz';
import AmpControl from './AmpControl';
import './AmpControl.css';

class AudioMenu extends Component {
    render() {  
    return (
        <div>
          <FrequencyViz/>  
          <AmpControl/>
        </div>
      );
    }
}

export default AudioMenu;
