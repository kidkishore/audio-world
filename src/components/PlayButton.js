import React, {Component} from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { playPause } from '../actions/effectActions';

class PlayButton extends Component{

    shouldComponentUpdate(nextProps){
      return this.props.playing != nextProps.playing;
    }

    handlePlay = () => { 
      if(this.props.playing){
          this.props.playPause(false);
      }else{
          //console.log('button is playing');
          this.props.playPause(true);
      }
    };

    render(){
      if(this.props.playing)
        return (
          <Button className="playButton" onClick={this.handlePlay} >
              <div className="stopIcon">
                  <i aria-hidden="true" className='stop icon'></i>
              </div>
          </Button>
        );
      else
        return (
          <Button className="playButton" onClick={this.handlePlay} >
              <div className="playIcon">
                  <i aria-hidden="true" className='play icon'></i>
              </div>
          </Button>
        );
    }
}


PlayButton.propTypes = {
  playPause: PropTypes.func,
  playing: PropTypes.bool
}

const mapStateToProps = state => {
  return {
      playing: state.audio.playing
  };
};

const mapDispatch = (dispatch) => {
  return {
    playPause: bindActionCreators(playPause, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatch)(PlayButton);