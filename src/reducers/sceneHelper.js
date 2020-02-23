import { threeScene } from '../threeApp/threeApp';
import GLTFLoader from 'three-gltf-loader';
import * as THREE from 'three';
import 'babel-polyfill';

import {
  updateBackground,
  updateText,
  changeCenter,
  changeOrbit
} from '../actions/sceneActions';

export const getBackground = (payload) => {

  return function(dispatch){
    return importBackground(payload).then(
      backgroundState => updateBackground(dispatch, backgroundState),
      error => console.log(error)
    )
  }

};

export const getCenter = (payload) => {
console.log('getting center')
  return function(dispatch){
    return importCenter(payload).then(
      centerState => dispatch(changeCenter(centerState)),
      error => console.log(error)
    )
  }

};

export const getOrbit = (payload) => {
  console.log('getting orbit')
    return function(dispatch){
      return importOrbit(payload).then(
        orbitState => dispatch(changeOrbit(orbitState)),
        error => console.log(error)
      )
    }
  
  };

  export const getText = (payload) => {

    return function(dispatch){
      return importText(payload).then(
        textState => updateText(dispatch, textState),
        error => console.log(error)
      )
    }
  
  };
  


export const importBackground = async(payload) => {

  let {name, id, editing} = payload;
  var parent;
  var backgroundState;

  let background = await import('../models/' + name);
  var backGeo = new THREE.SphereBufferGeometry( 500, 60, 40 );
  // invert the geometry on the x-axis so that all of the faces point inward
  backGeo.scale( - 1, 1, 1 );
  
  var texture = new THREE.TextureLoader().load( background.default );
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  var mesh = new THREE.Mesh( backGeo, material );


  if(!editing){
    parent = new THREE.Object3D();
    parent.name = 'Background';
    id = parent.id;
    threeScene.add(parent);
    parent.add(mesh);

  }else{
    parent = threeScene.getObjectById(id);
    parent.add(mesh);
    parent.remove(parent.children[0]);
  }

  backgroundState = {
    id: id,
    name: name,
    rotXAmt: 0.005,
    rotYAmt: 0.005,
    scale: 1
  }

  

  return backgroundState;


}

export const importCenter = async(payload) => {

  let {name, id, response, responseDamp, editing} = payload;

  let center = await import('../models/' + name + '.glb');
  let geometry = new THREE.SphereGeometry(1, 40, 40);
  var parent;
  
  if(!editing){
    parent = new THREE.Object3D();
    parent.name = 'Center';
    id = parent.id
    threeScene.add(parent);
  }else{
    parent = threeScene.getObjectById(id);
  }



  var objLoader = new GLTFLoader();
  objLoader.load(center.default, function (object) {
    parent.add(object.scene);
    if(editing)
      parent.remove(parent.children[0]);
  });

  const centerState = {
    id: id,
    name: name,
    rotXAmt: 0.005,
    rotYAmt: 0.005,
    scale: 1,
    response: response,
    responseDamp: responseDamp
  }

  return centerState;

  

}

export const importOrbit = async(payload) => {
  let {name, id, response, responseDamp, editing} = payload;
  let orbitModel = await import('../models/' + name + '.glb');

  var numPlanets = 4;
  var orbit = new THREE.Group();
  var counter = 0;
  var rotationMatrix = new THREE.Matrix4();
  var targetQuaternion = new THREE.Quaternion();
  var origin = new THREE.Vector3(0, 0, 0);
  var planets = {};


  //vertices of our planets
  var tetraVerts = [
      [1, 0, -1 / Math.sqrt(2)],
      [-1, 0, -1 / Math.sqrt(2)],
      [0, 1, 1 / Math.sqrt(2)],
      [0, -1, 1 / Math.sqrt(2)]
  ];

  const gltfPromiseLoader = promisifyLoader( new GLTFLoader() );
  var planet;
  var i;

  var orbitPromises= [];


  //load all planets to orbit
  for (i = 0; i < numPlanets + 1; i++) {
    const promiseOfOrbit = gltfPromiseLoader.load( orbitModel.default )
                                            .then( onOrbitLoad )
                                            .catch( (err)=>{console.log(err)} );
    orbitPromises.push(promiseOfOrbit);

    const onOrbitLoad = (object) => {
  
      var planet = new THREE.Group();
      var size = 0.3;
      planet.scale.x = size;
      planet.scale.y = size;
      planet.scale.z = size;
      planet.add(object.scene);
      planet.position.set(tetraVerts[counter][0], tetraVerts[counter][1], tetraVerts[counter][2]);
      //planet.scale.z = 10;
    
      //point planets to origin
      rotationMatrix.lookAt(origin, planet.position, planet.up);
      targetQuaternion.setFromRotationMatrix(rotationMatrix);
    
      planet.quaternion.copy(targetQuaternion);
      planets[counter] = planet;
      orbit.add(planet);
      counter += 1;
    
    }
  
  }  

  //orbitDir holds the orbit and is what scales!!
  var orbitDir;
  if(!editing){
    orbitDir = new THREE.Group();
    orbitDir.rotation.x = 0;//1.57;
    id = orbitDir.id
    orbitDir.name = 'Orbit';
    threeScene.add(orbitDir);
  }else{
    orbitDir = threeScene.getObjectById(id);
  }

  Promise.all( orbitPromises ).then( () => {
    orbitDir.add(orbit);
    if(editing)
      orbitDir.remove(orbitDir.children[0]);
  });
  

  const orbitState = {
    id,
    name,
    rotXAmt: 0.005,
    rotYAmt: 0.005,
    scale: 1,
    response,
    responseDamp
  }

  return orbitState;


}



function promisifyLoader ( loader, onProgress ) {

  function promiseLoader ( url ) {

    return new Promise( ( resolve, reject ) => {

      loader.load( url, resolve, onProgress, reject );

    } );
  }

  return {
    originalLoader: loader,
    load: promiseLoader,
  };

}

export const importText = async(payload) => {
  var textState;
  var parent;

  let {data, id, color, editing} = payload;

  var file = "square_font"
  let fontFile = await import('../models/' + file + '.json');

  var loader = new THREE.FontLoader(); 
  var font = loader.parse(fontFile.default); 

  var textParams = {
    font: font, 
    size: 0.3, 
    height: 0.1, 
    curveSegments: 20,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01
   }

  var textGeometry1 = new THREE.TextGeometry( data[0], textParams);
  var textGeometry2 = new THREE.TextGeometry( data[1], textParams);
  var textGeometry3 = new THREE.TextGeometry( data[2], textParams);

  var textMaterial = new THREE.MeshPhongMaterial( { color, shininess: 30 } ); 
  var textMesh1 = new THREE.Mesh( textGeometry1, textMaterial ); 
  var textMesh2 = new THREE.Mesh( textGeometry2, textMaterial ); 
  var textMesh3 = new THREE.Mesh( textGeometry3, textMaterial ); 

  var direction = new THREE.Vector3(0, 0, -1);
  var axis = new THREE.Vector3(0, 1, 0);
  var angle1 = Math.PI / 6 ;
  var angle2 = Math.PI / 6 ;
  var angle3 = Math.PI / 6 ;


  textMesh2.rotation.y = 2 * Math.PI / 3;
  textMesh3.rotation.y = 4 * Math.PI / 3;

  textMesh1.position.set(-1.3, 0, 2.2); //audio
  //textMesh2.position.set(2.4, 0, 0.2); //2cup
  textMesh2.position.set(2.8, 0, 0); //2cup
  textMesh3.position.set(-1.5, 0, -2.2); //vel


  modify(direction, axis, angle1, textMesh1.geometry );
  modify(direction, axis, angle2, textMesh2.geometry );
  modify(direction, axis, angle3, textMesh3.geometry );




  var group = new THREE.Group();

  group.add(textMesh1)
  group.add(textMesh2)
  group.add(textMesh3)

  group.name = 'Text';

  if(!editing){
    parent = new THREE.Group();
    id = parent.id
    parent.name = 'Text';
    threeScene.add(parent);
  }else{
    parent = threeScene.getObjectById(id);
  }

  parent.add(group);
  if(editing)
    parent.remove(parent.children[0]);

  textState = {
    id: id,
    data,
    color,
    name: 'text',
    rotXAmt: 0.003,
    rotYAmt: 0.003,
    scale: 1
  }

  return textState;


}

const modify = (direction, axis, angle, geometry) => {


  var thirdAxis = new THREE.Vector3();  thirdAxis.crossVectors(  direction,  axis );

  // P - matrices of the change-of-coordinates
  var P = new THREE.Matrix4();
  P.set ( thirdAxis.x, thirdAxis.y, thirdAxis.z, 0, 
     direction.x,  direction.y,  direction.z, 0, 
     axis.x,  axis.y,  axis.z, 0, 
    0, 0, 0, 1 ).transpose();
  var InverseP =  new THREE.Matrix4().getInverse( P );
  var newVertices = []; var oldVertices = []; var anglesBetweenOldandNewVertices = [];

  var meshGeometryBoundingBoxMaxx = 0; var meshGeometryBoundingBoxMinx = 0;
  var meshGeometryBoundingBoxMaxy = 0; var meshGeometryBoundingBoxMiny = 0;

  for (var i = 0; i < geometry.vertices.length; i++)  {

    newVertices[i] = new THREE.Vector3(); newVertices[i].copy( geometry.vertices[i] ).applyMatrix4( InverseP );
    if ( newVertices[i].x > meshGeometryBoundingBoxMaxx ) { meshGeometryBoundingBoxMaxx = newVertices[i].x; }
    if ( newVertices[i].x < meshGeometryBoundingBoxMinx ) { meshGeometryBoundingBoxMinx = newVertices[i].x; }
    if ( newVertices[i].y > meshGeometryBoundingBoxMaxy ) { meshGeometryBoundingBoxMaxy = newVertices[i].y; }
    if ( newVertices[i].y < meshGeometryBoundingBoxMiny ) { meshGeometryBoundingBoxMiny = newVertices[i].y; }

  }

  var meshWidthold =  meshGeometryBoundingBoxMaxx - meshGeometryBoundingBoxMinx;
  var meshDepth =  meshGeometryBoundingBoxMaxy - meshGeometryBoundingBoxMiny;
  var ParamB = 2 *  _sinhInverse( Math.tan(  angle ) ) / meshWidthold;
  var oldMiddlex = (meshGeometryBoundingBoxMaxx + meshGeometryBoundingBoxMinx) / 2;
  var oldMiddley = (meshGeometryBoundingBoxMaxy + meshGeometryBoundingBoxMiny) / 2;

  for (var i = 0; i < geometry.vertices.length; i++ )  {

    oldVertices[i] = new THREE.Vector3(); oldVertices[i].copy( newVertices[i] );
    newVertices[i].x =  _sign( newVertices[i].x - oldMiddlex ) * 1 / ParamB *  _sinhInverse( ( newVertices[i].x - oldMiddlex ) * ParamB );

  }

  var meshWidth = 2 / ParamB *  _sinhInverse( meshWidthold / 2 * ParamB );

  var NewParamB = 2 *  _sinhInverse( Math.tan(  angle ) ) / meshWidth;

  var rightEdgePos = new THREE.Vector3( meshWidth / 2, -meshDepth / 2, 0 );
  rightEdgePos.y = 1 / NewParamB *  _cosh( NewParamB * rightEdgePos.x ) - 1 / NewParamB - meshDepth / 2;

  var bendCenter = new THREE.Vector3( 0, rightEdgePos.y  + rightEdgePos.x / Math.tan(  angle ), 0 );

  for ( var i = 0; i < geometry.vertices.length; i++ )  {

    var x0 =  _sign( oldVertices[i].x - oldMiddlex ) * 1 / ParamB *  _sinhInverse( ( oldVertices[i].x - oldMiddlex ) * ParamB );
    var y0 = 1 / NewParamB *  _cosh( NewParamB * x0 ) - 1 / NewParamB;

    var k = new THREE.Vector3( bendCenter.x - x0, bendCenter.y - ( y0 - meshDepth / 2 ), bendCenter.z ).normalize();

    var Q = new THREE.Vector3();
    Q.addVectors( new THREE.Vector3( x0, y0 - meshDepth / 2, oldVertices[i].z ), k.multiplyScalar( oldVertices[i].y + meshDepth / 2 ) );
    newVertices[i].x = Q.x;  newVertices[i].y = Q.y;

  }	

  var middle = oldMiddlex * meshWidth / meshWidthold;

  for ( var i = 0; i < geometry.vertices.length; i++ )  {

    var O = new THREE.Vector3( oldMiddlex, oldMiddley, oldVertices[i].z );
    var p = new THREE.Vector3(); p.subVectors( oldVertices[i], O );
    var q = new THREE.Vector3(); q.subVectors( newVertices[i], O );

    anglesBetweenOldandNewVertices[i] = Math.acos( 1 /  _cosh( ParamB * newVertices[i].x ) )  *  _sign( newVertices[i].x );

    newVertices[i].x = newVertices[i].x + middle;
    geometry.vertices[i].copy( newVertices[i].applyMatrix4( P ) );

  }

  geometry.computeFaceNormals();
  geometry.verticesNeedUpdate = true;
  geometry.normalsNeedUpdate = true;

  // compute Vertex Normals
  var fvNames = [ 'a', 'b', 'c', 'd' ];
  var x, y, z;

  for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

    var face = geometry.faces[ f ];
    if ( face.vertexNormals === undefined ) {
      continue;
    }
    for ( var v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {

      var angle = anglesBetweenOldandNewVertices[ face[ fvNames[ v ] ] ];
      x =  axis.x; y =  axis.y; z =  axis.z;

      var rotateMatrix = new THREE.Matrix3();
      rotateMatrix.set ( Math.cos(angle) + (1-Math.cos(angle))*x*x, (1-Math.cos(angle))*x*y - Math.sin(angle)*z, (1-Math.cos(angle))*x*z + Math.sin(angle)*y,
              (1-Math.cos(angle))*y*x + Math.sin(angle)*z, Math.cos(angle) + (1-Math.cos(angle))*y*y, (1-Math.cos(angle))*y*z - Math.sin(angle)*x,
              (1-Math.cos(angle))*z*x - Math.sin(angle)*y, (1-Math.cos(angle))*z*y + Math.sin(angle)*x, Math.cos(angle) + (1-Math.cos(angle))*z*z );

      face.vertexNormals[ v ].applyMatrix3( rotateMatrix );

      }

    }
  // end compute Vertex Normals			
  
}

const _sign = (a) => {
  return 0 > a ? -1 : 0 < a ? 1 : 0
}

const _cosh = ( x ) => {
return ( Math.exp( x ) + Math.exp( -x ) ) / 2;
}

const _sinhInverse = ( x ) => {
  return  Math.log( Math.abs( x ) + Math.sqrt( x * x + 1 ) );
}
