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
import '../index.css';
import {objects, backgrounds} from '../constants.js';
import { analyser } from './AudioPlayer/FilePlayer';


class ThreeApp extends React.Component {
    
  componentDidMount() {        

    //Create separate functions for different objects in scene
    window.addEventListener("resize", this.updateDimensions.bind(this));
    var items = getThreeCameraAndRenderer();
    this.camera = items[0];
    this.threeRenderer = items[1];

    const initialBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)].value;
    const initialCenter = objects[Math.floor(Math.random() * (objects.length-3)+3)].value;
    const initialOrbit = objects[Math.floor(Math.random() * (objects.length-3)+3)].value;

    //Create the initial scene, camera, and renderer
    this.scene = getThreeScene(
      initialBackground,
      initialCenter,
      initialOrbit,
      this.props.addObject
      );


    this.renderNextFrame();

    
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

      const width = window.innerWidth;
      const height = window.innerHeight;

      if (this.camera && this.threeRenderer && (width > 420)) {
        this.threeRenderer.setSize( width,  height-bottomNavigation);
        this.camera.aspect =  width / ( height-bottomNavigation);
        this.camera.updateProjectionMatrix();
      }
  }

  render() {
      return (
          <div>
              <ThreeDisplay />
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