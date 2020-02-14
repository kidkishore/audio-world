import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CanvasRecorder } from '../../containers/CanvasRecorder';
import { Loader } from 'semantic-ui-react'
import '../MainScreen/MainScreen.css'
import { threeCanvas } from '../../threeApp/threeApp';
import { SendFile } from '../../containers/SendFile';
import Modal from 'react-modal';



/*
{this.state.generatedFile && 
              <div>
                <button className="btn"><i className="fa fa-download"></i> Download</button>
                  Email to send:<br/>
              <input type="text" id='user-email'/><br/>
              <br/>
                <button onClick={this.formSubmit}>
                  Send Video
                </button>
              </div>  
            } 
*/


Modal.setAppElement('#react-container');

class VideoRecorder extends Component {

  constructor(props){
    super(props)
    this.state = {
      recording: false,
      recorded_file: null,
      modalIsOpen: false,
      generatedFile: null,
      loading: false
    }
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.generateFile = this.generateFile.bind(this);
    this.getFileBack = this.getFileBack.bind(this);
  }

  componentDidMount() {  
    this.recorder = new CanvasRecorder(threeCanvas);
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

  generateFile(){
    this.setState({loading: true})
    var name = document.getElementById("user-file-name").value
    SendFile(name, this.state.recorded_file, this.getFileBack)

  }

  getFileBack(response){
    //console.log(response);
    //var name = response.data.data.Job.Output.Key
    var file_name = 'https://audioworld-recordings.s3-us-west-2.amazonaws.com/converted/' + response

    console.log('Generated file link ');
    this.setState({generatedFile: file_name})
    this.setState({loading: false})
    document.getElementById("audioElem").pause()
  }

  
  openModal() {
    this.setState({modalIsOpen: true});
  }

  
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({generatedFile: null})
    this.setState({modalIsOpen: false});
  }

  formSubmit(){
    var email = document.getElementById("user-email").value
    SendFile(name, email, this.state.recorded_file);
  }

  render(){
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        background            : '#383838',
        color                 : '#ebebeb',
        transform            
         : 'translate(-50%, -50%)'
      }
    };

    const {loading, recording, generatedFile} = this.state;

    return(
      <div className='video-recorder'>
        {!this.props.playing &&
          <button id="recorderButton" onClick={this.handleRecord} disabled>
            <i aria-hidden="true" className={recording ? "stop circle outline icon rt" : "video icon rt"}></i>
            {recording && <div className='rt'>Stop Recording</div>}
            {!recording && <div className='rt'>Start Recording</div>}
          </button>
       }{this.props.playing &&
          <button id="recorderButton" onClick={this.handleRecord}>
            <i aria-hidden="true" className={recording ? "stop circle outline icon rt" : "video icon rt"}></i>
            {recording && <div className='rt'>Stop Recording</div>}
            {!recording && <div className='rt'>Start Recording</div>}
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
            <div className='modal-row'>
              <br/>
              FILE NAME<br/>
              <input type="text" id='user-file-name'/><br/>
            </div>
            <div className='modal-row'>
              <button className="modal-button" onClick={this.generateFile}>
                Generate Video
              </button>
              {loading && <div className="loader"></div>}
              {generatedFile && 
                <button className="modal-button">
                  <a href={generatedFile} target="_blank">
                    View Video
                  </a>
                </button>
              }
            </div>
            <div className='modal-row'>
              <button className="modal-button" onClick={this.closeModal}>
                Cancel Recording
              </button>  
            </div>       
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