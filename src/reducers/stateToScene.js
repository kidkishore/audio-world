import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';


const changeObj = (name, objectToEdit) => {

  import('../models/' + name)
  .then(newModule => {
    //console.log('got new module: ', newModule);
    //console.log('trying to load: ', newModule);
    var objLoader = new GLTFLoader();
    objLoader.load(newModule.default, function (newObject) {
      objectToEdit.remove(objectToEdit.children[0]);
      
      objectToEdit.add(newObject.scene);

    });
    
  });
  
};

const changeBackground = (name, objectToEdit) => {

  import('../models/' + name)
  .then(newModule => {

    var backGeo = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    backGeo.scale( - 1, 1, 1 );
    var texture = new THREE.TextureLoader().load( newModule.default );
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var mesh = new THREE.Mesh( backGeo, material );
    objectToEdit.add(mesh);
    objectToEdit.remove(objectToEdit.children[0]);
    
  });
  
};

const changeOrbit = (name, objectToEdit) => {
//console.log('changing orbit');

  import('../models/' + name)
  .then(newModule => {
    var numPlanets = 4;
    var orbit = new THREE.Group();
    var counter = 0;
    var i;

    var rotationMatrix = new THREE.Matrix4();
    var targetQuaternion = new THREE.Quaternion();
    var origin = new THREE.Vector3(0, 0, 0);

    var tetraVerts = [
        [1, 0, -1 / Math.sqrt(2)],
        [-1, 0, -1 / Math.sqrt(2)],
        [0, 1, 1 / Math.sqrt(2)],
        [0, -1, 1 / Math.sqrt(2)]
    ];



    var gltfLoader = new GLTFLoader();
    var planet;

    for (i = 0; i < numPlanets; i++) {

        gltfLoader.load(
          newModule.default,
            function (newObject) {

                planet = new THREE.Group();

                var size = 0.3;

                planet.scale.x = size;
                planet.scale.y = size;
                planet.scale.z = size;

                planet.add(newObject.scene);

                planet.position.set(tetraVerts[counter][0], tetraVerts[counter][1], tetraVerts[counter][2]);
                //planet.scale.z = 10;

                //point planets to origin
                rotationMatrix.lookAt(origin, planet.position, planet.up);
                targetQuaternion.setFromRotationMatrix(rotationMatrix);

                planet.quaternion.copy(targetQuaternion);


                orbit.add(planet);
                counter += 1;

                if(counter === 3){
                  objectToEdit.remove(objectToEdit.children[0]);
                  objectToEdit.add(orbit);
                }

            }
        );

    }

    
    
  });
  
};



//map state to scene
export const mapStateToScene = (sceneState, frequencies, scene, clearObjectsToRemove, clearObjectsToEdit) => {
  //console.log('freq: ', frequencies);

  var i;
  var sceneObject;
  var object;

  //*********DELETION***********//
  for( i = 0; i < sceneState.objectsToRemove.length; i++){
    var sceneObjectId = sceneState.objectsToRemove[i];
    object = scene.getObjectById(sceneObjectId);
    scene.remove(object);
    
  }

  if(sceneState.objectsToRemove.length > 0){
    clearObjectsToRemove();
  } 

  //*********EDITING OBJECTS***********//
  for( i = 0; i < sceneState.objectsToEdit.length; i++){
    sceneObject = sceneState.objectsToEdit[i];
    var objectToEdit = scene.getObjectById(sceneObject.id);
    switch(objectToEdit.name){
      case 'Center': 
        changeObj(sceneObject.file, objectToEdit);
        break;
      case 'Orbit':
        changeOrbit(sceneObject.file, objectToEdit);
        break;
      case 'Background':
        changeBackground(sceneObject.file, objectToEdit);
        break;
    }
    
  
      
  }

  if(sceneState.objectsToEdit.length > 0){
    clearObjectsToEdit();
  } 

  //*********UPDATION***********//

  //LOOP through all objects in scene, and update them
  for( i = 0; i < sceneState.objects.length; i++){
    
    //acquire object
    sceneObject = sceneState.objects[i];
    object = scene.getObjectById(sceneObject.id);

    //modify position
    if(object){
      object.position.set( sceneObject.posX, sceneObject.posY, sceneObject.posZ);

      
      //modify Y rotation regardless
      if(i%2==0)
        object.rotation.y += sceneObject.rotXAmt;
      else
        object.rotation.y -= sceneObject.rotXAmt;

      
      if(sceneObject.name == 'Orbit'){
        object.rotation.x += sceneObject.rotXAmt;
      }

      

      //modify scale w.r.t. frequencies
      var responseFreq = frequencies[sceneObject.response] / sceneObject.responseDamp;
      var newScale = Math.max(responseFreq, 1);
      if(!newScale) newScale = 1;

      object.scale.x = newScale * sceneObject.scale;
      object.scale.y = newScale * sceneObject.scale;
      object.scale.z = newScale * sceneObject.scale;
    }

  }
  

}