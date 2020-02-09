import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { update } from '../actions/effectActions';
import { Button } from 'semantic-ui-react';
import ThreeDisplay from '../components/ThreeDisplay';
import {
    getThreeCameraAndRenderer,
    getThreeScene,
//    getNewThreeScene
} from '../threeApp/threeApp';
import {bindActionCreators} from 'redux';
import { mapStateToScene } from '../reducers/stateToScene';
import {
  addObject,
  clearObjectsToRemove,
  clearObjectsToEdit
} from '../actions/sceneActions';
import { setFrequencies } from '../actions/effectActions';
import '../index.css'
import { CanvasRecorder } from './CanvasRecorder';
import axios from 'axios';
import { audioStream, analyser } from './AudioPlayer/FilePlayer';


class ThreeApp extends React.Component {
    

  constructor(props){
    super(props)

    this.state = {
      recording: false
    }
  }

  componentDidMount() {        
      //Create separate functions for different objects in scene
      var items = getThreeCameraAndRenderer();
      this.camera = items[0];
      this.threeRenderer = items[1];

      //Create the initial scene, camera, and renderer
      this.scene = getThreeScene(this.props.addObject);
      this.recorder = new CanvasRecorder(this.threeRenderer.domElement, audioStream, 's3_test_3');
      this.renderNextFrame();
      window.addEventListener("resize", this.updateDimensions.bind(this));

    
  }


  componentDidUpdate() {

      //update Scene everytime state of scene changes
      mapStateToScene(this.props.sceneState, this.props.frequencies, this.scene, this.props.clearObjectsToRemove, this.props.clearObjectsToEdit);
      this.renderNextFrame();

      //sample importing model
      //import('../models/Duck.glb')
      //.then(newModule => console.log('got it'))
  }

  shouldComponentUpdate(nextProps){
    //only update when scene changes ()
      return nextProps.timestamp != this.props.timestamp;
  }

  renderNextFrame = () => {
      //render and request next frame

      this.threeRenderer.render(this.scene, this.camera);

      requestAnimationFrame(timestamp => {
          this.props.update(timestamp);
      });

      if(analyser){
        var dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        this.props.setFrequencies(dataArray);
      }
  }

  updateDimensions = () => {
      const bottomNavigation = 0;
      if (this.threeRenderer)
          this.threeRenderer.setSize(window.innerWidth, window.innerHeight-bottomNavigation);
      if (this.camera) {
          this.camera.aspect = window.innerWidth / (window.innerHeight-bottomNavigation);
          this.camera.updateProjectionMatrix();
      }
  }

  handleRecord = () => {

    if(!this.state.recording){
      this.setState({ recording: true });
      this.recorder.start();
    }else{
      this.setState({ recording: false });
      this.recorder.stop();
      //this.recorder.save('s3_test_1')
      //const new_file = this.recorder.save('s3_test_2')
      //console.log(new_file)
      //this.handleUpload(new_file);
    }

  };

  handleUpload = ( file ) => {
    const data = new FormData();
    console.log('handling file upload: ', file);
// If file selected
		if ( file ) {
			data.append( 'webmVideo', file, file.name );
			axios.post( '/api/profile/webm-video-upload', data, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				}
			})
				.then( ( response ) => {
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								console.log( 'Max size: 2MB');
							} else {
								console.log( response.data );
// If not the given file type
								console.log( response.data.error);
							}
						} else {
							// Success
							let fileName = response.data;
							console.log( 'filedata', fileName );
							console.log( 'File Uploaded');
						}
					}
				}).catch( ( error ) => {
				// If another error
				console.log( error );
			});
		} else {
			// if file not selected throw error
			console.log( 'Please upload file' );
		}
	}

  render() {
      return (
          <div>
              <ThreeDisplay />
              <Button className="ui icon button recordButton" onClick={this.handleRecord} >
                  <i aria-hidden="true" className={this.state.recording ? "stop circle outline icon" : "video icon"}></i>
              </Button>
          </div>
      );
  }
}

ThreeApp.propTypes = {
  sceneState: PropTypes.object,
  frequencies: PropTypes.object,
  timestamp: PropTypes.number,
  update: PropTypes.func,
  addObject: PropTypes.func,
  clearObjectsToRemove: PropTypes.func,
  clearObjectsToEdit: PropTypes.func,
  setFrequencies: PropTypes.func

}

//the ThreeApp uses the sceneState and frequencies
const mapStateToProps = state => {
    return {
        sceneState: state.scene,
        frequencies: state.audio.frequencies,
        timestamp: state.scene.timestamp
    };
};


const mapDispatch = (dispatch) => {
  return {
    update: bindActionCreators(update, dispatch),
    addObject: bindActionCreators(addObject, dispatch),
    clearObjectsToRemove: bindActionCreators(clearObjectsToRemove, dispatch),
    clearObjectsToEdit: bindActionCreators(clearObjectsToEdit, dispatch),
    setFrequencies: bindActionCreators(setFrequencies, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatch)(ThreeApp);