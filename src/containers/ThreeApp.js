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
  addBackground,
  addCenter,
  addOrbit,
  addText
} from '../actions/sceneActions';
import { setFrequencies } from '../actions/effectActions';
import '../index.css';
import {objects, backgrounds} from '../constants.js';
import { analyser } from './AudioPlayer/FilePlayer';
import {BASS, LOMID, TREBLE} from '../constants';



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
    const initialText = ['audioworld.io', 'audioworld.io','audioworld.io']
    //Create the initial scene, camera, and renderer

    this.scene = getThreeScene(
      initialBackground,
      initialCenter,
      initialOrbit,
      this.props.addObject
      );


    this.props.addBackground(initialBackground);  
    this.props.addCenter(initialCenter, LOMID, 200);  
    this.props.addOrbit(initialOrbit, TREBLE, 80);  
    this.props.addText(initialText);  

    this.renderNextFrame();

    
  }


  componentDidUpdate() {

      //update Scene everytime state of scene changes
      mapStateToScene(this.props.sceneState, this.props.frequencies, this.scene);
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
  frequencies: PropTypes.array,
  timestamp: PropTypes.number,
  update: PropTypes.func,
  addBackground: PropTypes.func,
  addOrbit: PropTypes.func,
  addCenter: PropTypes.func,
  addText: PropTypes.func,
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
    addOrbit: bindActionCreators(addOrbit, dispatch),
    addCenter: bindActionCreators(addCenter, dispatch),
    addBackground: bindActionCreators(addBackground, dispatch),
    addText: bindActionCreators(addText, dispatch),
    update: bindActionCreators(update, dispatch),
    setFrequencies: bindActionCreators(setFrequencies, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatch)(ThreeApp);