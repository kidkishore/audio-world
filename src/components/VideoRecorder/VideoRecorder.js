import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CanvasRecorder } from '../../containers/CanvasRecorder';
import '../MainScreen/MainScreen.css'
import { threeCanvas } from '../../threeApp/threeApp';
import { SendFile } from '../../containers/SendFile';
import Modal from 'react-modal';




Modal.setAppElement('#react-container');

class VideoRecorder extends Component {

  constructor(props){
    super(props)
    this.state = {
      recording: false,
      recorded_file: null,
      modalIsOpen: true
    }
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {  
    this.recorder = new CanvasRecorder(threeCanvas, 's3_test_7');
  }

  handleRecord = () => {

    if(!this.state.recording){
      this.setState({ recorded_file: null });
      this.setState({ recording: true });
      this.recorder.start();
    }else{
      this.setState({ recording: false });
      const new_file = this.recorder.stop();
      this.setState({ recorded_file: new_file });
      //console.log(this.state.recorded_file);

      this.openModal()
      //this.recorder.save('s3_test_1')
      // const new_file = this.recorder.save('s3_test_2')
      //console.log(new_file)
      //SendFile(new_file);
    }

  };

  
  openModal() {
    this.setState({modalIsOpen: true});
  }

  
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  formSubmit(){
    console.log('form data: ')
    console.log(document.getElementById("user-file-name").value)
    console.log(document.getElementById("user-email").value)
    console.log(this.state.recorded_file)
  }

  render(){

    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return(
      <div id='video-recorder'>
        {this.props.playing && 
          <button id="recorderButton" onClick={this.handleRecord}>
            <i aria-hidden="true" className={this.state.recording ? "stop circle outline icon" : "video icon"}></i>
          </button>
        }{!this.props.playing && 
          <button id="recorderButton" onClick={this.handleRecord} disabled>
            <i aria-hidden="true" className={this.state.recording ? "stop circle outline icon" : "video icon"}></i>
          </button>
        }
        <div className="recordedModal">
          <Modal
            isOpen={this.state.modalIsOpen}
            style={customStyles}
            onRequestClose={this.closeModal}
            contentLabel="Example Modal"
          >
            <h2>Save Your Recording</h2>
            <br/>
            File Name:<br/>
            <input type="text" id='user-file-name'/><br/>
            Email to send:<br/>
            <input type="text" id='user-email'/><br/>
            <br/>
            <button onClick={this.formSubmit}>
              Send Video
            </button>
            <button onClick={this.closeModal}>Cancel Recording</button>            
          </Modal>
        </div>
      </div>
    )
  }
}

VideoRecorder.propTypes = {
  playing: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    playing: state.audio.playing
  };
};

export default connect(mapStateToProps, null)(VideoRecorder);