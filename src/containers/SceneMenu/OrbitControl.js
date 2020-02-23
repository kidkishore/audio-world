import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { editOrbit, updateOrbit } from '../../actions/sceneActions';
import { objects, responses } from '../../constants';
import './SceneMenu.css';

class OrbitControl extends Component {

  orbitSelected = (event, data) => {
    let {id, response, responseDamp} = this.props.orbit; 
    this.props.editOrbit(data.value, id, response, responseDamp)
  }

  objectFreqSelected = (event, data) => { 
    var response = data.value;
    var responseDamp = responses[response].damping;
    this.props.updateOrbit({...this.props.orbit, response, responseDamp})
  }
   
  render(){

    const { name, response } = this.props.orbit;
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
              onChange={this.orbitSelected}
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

OrbitControl.defaultProps = {
  orbit: {}
};

OrbitControl.propTypes = {
  orbit: PropTypes.object.isRequired,
  editOrbit: PropTypes.func,
  editObjectFreq: PropTypes.func
};

const mapStateToProps = state => {
  return {
      orbit: state.scene.orbit
  };
};

const mapDispatch = (dispatch) => {
  return {
    editOrbit: bindActionCreators(editOrbit, dispatch),
    updateOrbit: bindActionCreators(updateOrbit, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatch)(OrbitControl);