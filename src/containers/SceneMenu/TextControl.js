import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'
import { editText } from '../../actions/sceneActions';
import { objects, responses } from '../../constants';
import { CompactPicker } from 'react-color';
import './SceneMenu.css';
import { defaultColor } from '../../constants'; 

class TextControl extends Component {

  constructor(props){
    super(props)
    this.state = {
      color: defaultColor,
    }
  }

  handleUpdate = () => { 
    var text1 =  document.getElementById("text1").value;
    var text2 =  document.getElementById("text2").value;
    var text3 =  document.getElementById("text3").value;

    var newText = [text1, text2, text3]

    this.props.editText(newText, this.props.text.id, this.state.color)

  }

  handleColorChange = (color) => {
    this.setState({color: color.hex})
  }

  

  render(){
    let{data: [text1, text2, text3]} = this.props.text;
    return(
      <div className='objectControls'>
          <div className='inputField'>
              Entry 1: <input type="text" id='text1' defaultValue={text1}/><br/>
              Entry 2: <input type="text" id='text2' defaultValue={text2}/><br/>
              Entry 3: <input type="text" id='text3' defaultValue={text3}/><br/>
          </div>
          <div className='inputField'><CompactPicker onChangeComplete={ this.handleColorChange }/></div>
          <div className='inputField'>
            <button onClick={this.handleUpdate}>Update</button>
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      text: state.scene.text
  };
};

const mapDispatch = (dispatch) => {
  return {
    editText: bindActionCreators(editText, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatch)(TextControl);