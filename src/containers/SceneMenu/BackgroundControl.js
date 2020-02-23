import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { editBackground } from '../../actions/sceneActions';
import { backgrounds } from '../../constants';
import './SceneMenu.css';

class BackgroundControl extends Component {

  backgroundSelected = (event, data) => { 
    this.props.editBackground(data.value, this.props.background.id);
  }

   
  render(){

    const { name } = this.props.background;
      return(
        <div className='objectControls'>
          <div className='inputField'>
            Image:
            <Dropdown
              floating
              labeled
              defaultValue={name}
              options={backgrounds}
              onChange={this.backgroundSelected}
              scrolling
            />
          </div>
        </div>
      );
  }
}

BackgroundControl.defaultProps = {
  background: {}
};

BackgroundControl.propTypes = {
  background: PropTypes.object.isRequired,
  editBackground: PropTypes.func,
};

const mapStateToProps = state => {
  return {
      background: state.scene.background
  };
};

const mapDispatch = (dispatch) => {
  return {
    editBackground: bindActionCreators(editBackground, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatch)(BackgroundControl);