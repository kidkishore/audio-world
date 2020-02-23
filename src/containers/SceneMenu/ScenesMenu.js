import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import './SceneMenu.css';
import {
  editCenter,
  editBackground,
  editOrbit,
} from '../../actions/sceneActions.js';
import { scenes, sceneDetail } from '../../constants.js';

class ScenesMenu extends Component {

  changeScene = (e, obj) => {
    const {Background, Center, Orbit} = sceneDetail[obj.value];
    this.props.editBackground(Background, this.props.background.id)
    this.props.editCenter(Center, this.props.center.id, this.props.center.response, this.props.center.responseDamp)
    this.props.editOrbit(Orbit, this.props.orbit.id, this.props.orbit.response, this.props.orbit.responseDamp)
  };

  render() {  
    return (
      <div className="objectsAccordian">
        Current Scene:
        <Dropdown
          placeholder='Select Scene'
          fluid
          selection
          scrolling={false}
          options={scenes}
          onChange={this.changeScene}
        />
      </div>
    );
  }
}

ScenesMenu.propTypes = {
  editOrbit: PropTypes.func,
  editCenter: PropTypes.func,
  editBackground: PropTypes.func,
  orbit: PropTypes.object,
  center: PropTypes.object,
  background: PropTypes.object
}

const mapStateToProps = state => {
  return {
      orbit: state.scene.orbit,
      center: state.scene.center,
      background: state.scene.background,
  };
};

const mapDispatch = (dispatch) => {
  return {
    editCenter: bindActionCreators(editCenter, dispatch),
    editBackground: bindActionCreators(editBackground, dispatch),
    editOrbit: bindActionCreators(editOrbit, dispatch)
  };
};

export default connect(mapStateToProps,mapDispatch)(ScenesMenu);