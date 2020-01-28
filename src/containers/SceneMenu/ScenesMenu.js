import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import './SceneMenu.css';
import { changeScene } from '../../actions/sceneActions.js';
import { scenes } from '../../constants.js';

class ScenesMenu extends Component {

  changeScene = (e, obj) => {
    this.props.changeScene(obj.value);
  };


    render() {  
    
    return (
      <div className="objectsAccordian">
        Current Scene:
        <Dropdown
          placeholder='Select Scene'
          fluid
          selection
          options={scenes}
          onChange={this.changeScene}
        />

          
       </div>
      );
    }

}

ScenesMenu.propTypes ={
  changeScene: PropTypes.func
}

const mapDispatch = (dispatch) => {
  return {
    changeScene: bindActionCreators(changeScene, dispatch)
  };
};


export default connect(null,mapDispatch)(ScenesMenu);