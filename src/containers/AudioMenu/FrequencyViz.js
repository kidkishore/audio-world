import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import P5Wrapper from 'react-p5-wrapper';

class FrequencyViz extends Component {

    sketch(p) {

      var height = 400;
      var barWidth = 50;
      var bassFreq, loMidFreq, midFreq, hiMidFreq, trebleFreq;

      p.setup = () => {
        p.createCanvas(250, 275);
        p.fill('red');
      };

      p.draw = () => {

          p.background(0);


          p.fill('red');
          p.stroke(255);

          bassFreq = this.props.frequencies[0];
          loMidFreq = this.props.frequencies[1];
          midFreq = this.props.frequencies[2];
          hiMidFreq = this.props.frequencies[3];
          trebleFreq = this.props.frequencies[4];
          //console.log('bass: ', bass, 'mid: ', mid, ' treble: ', treble);
          const {bass, loMid, mid, hiMid, treble} = this.props.ampControl;
          
          bassFreq = p.map(bassFreq, 0, 256, 0, 300)-50 + bass;
          p.rect(0, height - bassFreq, barWidth, bassFreq);

          loMidFreq = p.map(loMidFreq, 0, 256, 0, 300)-50 + loMid;
          p.rect(barWidth, height - loMidFreq, barWidth, loMidFreq);

          midFreq = p.map(midFreq, 0, 256, 0, 300)-50 + mid;
          p.rect(barWidth*2, height - midFreq, barWidth, midFreq);

          hiMidFreq = p.map(hiMidFreq, 0, 256, 0, 300)-50 + hiMid;
          p.rect(barWidth*3, height - hiMidFreq, barWidth, hiMidFreq);

          trebleFreq = p.map(trebleFreq, 0, 256, 0, 300)-50 + treble;
          p.rect(barWidth*4, height - trebleFreq, barWidth, trebleFreq);

      };
    }

    shouldComponentUpdate() {
        return false;
    }



    render() {
        // console.log("::: P5Wrapper.props:", this.props);
        return (
            <div id="typehead">
                <P5Wrapper
                    sketch={this.sketch.bind(this)}>
                </P5Wrapper>
            </div>
            
        );
    }
}

FrequencyViz.propTypes = {
  frequencies: PropTypes.array,
  ampControl: PropTypes.object,
}

const mapStateToProps = state => {
    return {
        frequencies: state.audio.frequencies,
        ampControl: state.audio.ampControl
    };
};

export default connect(mapStateToProps,null)(FrequencyViz);