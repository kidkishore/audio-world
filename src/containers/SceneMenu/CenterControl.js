import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { editCenter, updateCenter } from '../../actions/sceneActions';
import { objects, responses } from '../../constants';
import './SceneMenu.css';

class CenterControl extends Component {

  centerSelected = (event, data) => {
    let {id, response, responseDamp} = this.props.center; 
    this.props.editCenter(data.value, id, response, responseDamp)
  }

  objectFreqSelected = (event, data) => { 
    var response = data.value;
    var responseDamp = responses[response].damping;
    this.props.updateCenter({...this.props.center, response, responseDamp})
  }
   
  render(){

    const { name, response } = this.props.center;
    const curr_response = responses[response].text;

      return(
        <div className='objectControls'>
          <div className='inputField'>
            Model:
            <Dropdown
              floating
              labeled
              defaultValue={name}
              options={objects}
              onChange={this.centerSelected}
              scrolling
            />
          </div>
          <div className='inputField'>
            Response Freq:
            <Dropdown
              floating
              labeled
              defaultValue={response}
              options={responses}
              onChange={this.objectFreqSelected}
              scrolling
            />
          </div>
        </div>
      );
  }
}

CenterControl.defaultProps = {
  center: {}
};

CenterControl.propTypes = {
  center: PropTypes.object.isRequired,
  editCenter: PropTypes.func,
  updateCenter: PropTypes.func
};

const mapStateToProps = state => {
  return {
      center: state.scene.center
  };
};

const mapDispatch = (dispatch) => {
  return {
    editCenter: bindActionCreators(editCenter, dispatch),
    updateCenter: bindActionCreators(updateCenter, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatch)(CenterControl);