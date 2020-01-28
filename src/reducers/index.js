import { audioReducer } from './audioReducer';
import { sceneReducer } from './scenesReducer';


const rootReducer = (state, action) => {
  return {
    audio: audioReducer(state.audio, action),
    scene: sceneReducer(state.scene, action)
    }
}

export default rootReducer;
