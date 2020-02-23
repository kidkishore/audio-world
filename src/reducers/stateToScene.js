
export const mapStateToScene = (sceneState, frequencies, scene, clearObjectsToRemove, clearObjectsToEdit) => {



  var responseFreq;
  var newScale;

  if(sceneState.background){
    let background = scene.getObjectById(sceneState.background.id);
    if(background){
      background.rotation.y += sceneState.background.rotXAmt;
    }
  }

  if(sceneState.center){
    let center = scene.getObjectById(sceneState.center.id);
    if(center){
      center.rotation.y += sceneState.center.rotXAmt;

      responseFreq = (frequencies[sceneState.center.response] * 1.0) / sceneState.center.responseDamp;

      newScale = Math.max(responseFreq, 1);
      if(!newScale) newScale = 1;

      center.scale.x = newScale * sceneState.center.scale;
      center.scale.y = newScale * sceneState.center.scale;
      center.scale.z = newScale * sceneState.center.scale;
    }
  }

  if(sceneState.orbit){
    let orbit = scene.getObjectById(sceneState.orbit.id);
    if(orbit){

      responseFreq = (frequencies[sceneState.orbit.response] * 1.0) / sceneState.orbit.responseDamp;

      newScale = Math.max(responseFreq, 1);
      if(!newScale) newScale = 1;

      orbit.rotation.x += sceneState.orbit.rotXAmt * newScale;
      orbit.rotation.y += sceneState.orbit.rotYAmt * newScale;

      orbit.scale.x = newScale * sceneState.orbit.scale;
      orbit.scale.y = newScale * sceneState.orbit.scale;
      orbit.scale.z = newScale * sceneState.orbit.scale;
    }
  }

  if(sceneState.text){
    let text = scene.getObjectById(sceneState.text.id);
    if(text){
      text.rotation.y -= sceneState.text.rotXAmt;
    }
  }


}