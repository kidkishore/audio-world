import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { deleteObject, editObject, editObjectFreq, changeTransform } from '../../actions/sceneActions';
import { objects, responses } from '../../constants.js';
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

 

*/

class ObjectControls extends Component {

  

  objectSelected = (event, data) => { 
    this.props.editObject(data.value, this.props.object.id)
  }

  objectFreqSelected = (event, data) => { 
    var damping;
    switch(data.value){
      case 0:
        damping = 200;
        break;
      case 1:
        damping = 160;
        break;
      case 2:
      damping = 130;
        break;
      case 3:
        damping = 100;
        break;
      case 4:
        damping = 80;
        break;
      default:
        damping = 200;
        break;
    }
    this.props.editObjectFreq(data.value, damping, this.props.object.id)
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
          <div className='inputField'>
            Response Freq: 
            <Dropdown
              floating
              labeled
              defaultValue={object.response}
              options={responses}
              onChange={this.objectFreqSelected}
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
  editObject: PropTypes.func,
  editObjectFreq: PropTypes.func
};

const mapDispatch = (dispatch) => {
  return {
    deleteObject: bindActionCreators(deleteObject, dispatch),
    editObject: bindActionCreators(editObject, dispatch),
    editObjectFreq: bindActionCreators(editObjectFreq, dispatch),
    changeTransform: bindActionCreators(changeTransform, dispatch)
  };
};


export default connect(null, mapDispatch)(ObjectControls);