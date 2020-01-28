import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { deleteObject, editObject, changeTransform } from '../../actions/sceneActions';
import { objects } from '../../constants.js';
import './SceneMenu.css';

/*
<div className='modelUpload'><input type="file" onChange={this.fileSelected}/></div>

fileSelected = event => { 
    console.log(event.target.files[0]);
    console.log('object id: ', this.props.object.id);
    this.props.editObject(event.target.files[0].name, this.props.object.id)

  }


<Button className="sceneMenuButton" onClick={() => this.props.deleteObject(object.id)} >
              Delete
            </Button>

 

  scaleChange = event => { 
    this.props.changeTransform({...this.props.object, scale: event.target.value}, this.props.object.id)

  }

  <div className='inputField'>
            Response Freq: 
            <Dropdown
              floating
              labeled
              defaultValue={object.response}
              options={responses}
            />
          </div>

*/

class ObjectControls extends Component {

  objectSelected = (event, data) => { 
    this.props.editObject(data.value, this.props.object.id)
  }

  
  render(){

    const { object } = this.props;
      return(
        <div className='objectControls'>
          <div className='inputField'>
            Model:
            <Dropdown
              floating
              labeled
              defaultValue={object.value}
              options={objects}
              onChange={this.objectSelected}
            />
          </div>
        </div>
      );
  }
}

ObjectControls.defaultProps = {
  object: {}
};

ObjectControls.propTypes = {
  object: PropTypes.object,
  editObject: PropTypes.func
};

const mapDispatch = (dispatch) => {
  return {
    deleteObject: bindActionCreators(deleteObject, dispatch),
    editObject: bindActionCreators(editObject, dispatch),
    changeTransform: bindActionCreators(changeTransform, dispatch)
  };
};


export default connect(null, mapDispatch)(ObjectControls);