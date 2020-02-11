import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import duckModel from '../models/Duck.glb';
import centerModel from '../models/Earth.glb';
import backgroundImage from '../models/space.jpeg';
import OrbitControls from 'three-orbitcontrols';
import {BASS, LOMID, TREBLE} from '../constants';

export var threeCanvas;

//INITIAL CAMERA AND RENDERER
export const getThreeCameraAndRenderer = () => {
    const bottomNavigation = 0;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight-bottomNavigation), 0.01, 1500);
    camera.position.y = 0.2;
    camera.position.z = 5;

    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight-bottomNavigation);
    container.appendChild(renderer.domElement);
    threeCanvas = renderer.domElement;

    var controls = new OrbitControls(camera, renderer.domElement);

    return [camera, renderer, controls];
}

const loadObj = (objName, name, url, scene, addObject) => {
  var parent = new THREE.Object3D();
  parent.name = name;

  scene.add(parent);

  var objLoader = new GLTFLoader();
  objLoader.load(url, function (object) {
      var parent = scene.getObjectByName(name);
      if (parent) {
          parent.add(object.scene);
      }
  });

  addObject(parent.id, objName, parent.name, LOMID, 200);
};


//SCENE UPDATE
export const getThreeScene = (initialBackground, initialCenter, initialOrbit, addObject) => {


    var geometry;
    const scene = new THREE.Scene();

  //////////*************Creating Background******************///////////
  import('../models/' + initialBackground)
    .then(newModule => {

      var backGeo = new THREE.SphereBufferGeometry( 500, 60, 40 );
      // invert the geometry on the x-axis so that all of the faces point inward
      backGeo.scale( - 1, 1, 1 );
      
      var texture = new THREE.TextureLoader().load( newModule.default );
      var material = new THREE.MeshBasicMaterial( { map: texture } );
      var mesh = new THREE.Mesh( backGeo, material );

      var parent = new THREE.Object3D();
      parent.name = 'Background';

      scene.add(parent);
      parent.add(mesh);
      addObject(parent.id, 'Space', parent.name, BASS, 200);

    });


  //////////*************Creating Center******************///////////

  import('../models/' + initialCenter + '.glb')
  .then(newModule => {
    geometry = new THREE.SphereGeometry(1, 40, 40);
    loadObj('Earth',"Center", newModule.default, scene, addObject);    /************ Adding object 1************/
  })
      

  //////////*************Creating Orbitals******************///////////

  import('../models/' + initialOrbit + '.glb')
    .then(newModule => {

      var numPlanets = 4;
      var orbit = new THREE.Group();
      var counter = 0;

      //vertices of our planets
      var tetraVerts = [
          [1, 0, -1 / Math.sqrt(2)],
          [-1, 0, -1 / Math.sqrt(2)],
          [0, 1, 1 / Math.sqrt(2)],
          [0, -1, 1 / Math.sqrt(2)]
      ];

      var gltfLoader = new GLTFLoader();
      var planet;
      var i;
      //load all planets to orbit
      for (i = 0; i < numPlanets; i++) {
        gltfLoader.load(
          newModule.default,
            function (object) {

                planet = new THREE.Group();
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
                planets[i] = planet;
                orbit.add(planet);
                counter += 1;

            }
        );

      }

      //orbitDir holds the orbit and is what scales!!
      var orbitDir = new THREE.Group();
      orbitDir.rotation.x = 0;//1.57;
      orbitDir.add(orbit);
      orbitDir.name = 'Orbit';

      //adding particles to redux objects
      addObject(orbitDir.id, 'Duck', orbitDir.name, TREBLE, 80);        /************ Adding object 3************/
      scene.add(orbitDir); 
    });

//////////*************Creating Stars******************///////////


/*
    geometry = new THREE.BufferGeometry();

    
    var vertices = [];
    for (var i = 0; i < 500; i++) {
        vertices.push(THREE.Math.randFloatSpread(200)); // x
        vertices.push(THREE.Math.randFloatSpread(200)); // y
        vertices.push(THREE.Math.randFloatSpread(200)); // z
    }

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
*/

  //adding particles to redux objects
  //addObject(particles.id, particles.name, BASS, MAXINT);      /************ Adding object 2************/


      
  //////////*************Creating Other Scene Lights and Items******************///////////
  var rotationMatrix = new THREE.Matrix4();
  var targetQuaternion = new THREE.Quaternion();
  var origin = new THREE.Vector3(0, 0, 0);
  var planets = {};


  //lights
  var ambientLight = new THREE.AmbientLight(0xffffff, 5);
  ambientLight.position.set(-1, -1, -1).normalize();
  //scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xfff1a8, 5);
  directionalLight.position.set(10, 0, 10).normalize();
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight(0xfff1a8, 5);
  directionalLight.position.set(-10, 0, -10).normalize();
  scene.add(directionalLight);

    return scene;
}

//////*****Raycast sample********//////

/*

var renderer, scene, camera, stats;
var pointclouds;
var raycaster;
var mouse = new THREE.Vector2();
var intersection = null;
var spheres = [];
var spheresIndex = 0;
var clock;
var threshold = 0.1;
var pointSize = 0.05;
var width = 80;
var length = 160;
var rotateY = new THREE.Matrix4().makeRotationY( 0.005 );
//init();
//animate();
function generatePointCloudGeometry( color, width, length ) {
  var geometry = new THREE.BufferGeometry();
  var numPoints = width * length;
  var positions = new Float32Array( numPoints * 3 );
  var colors = new Float32Array( numPoints * 3 );
  var k = 0;
  for ( var i = 0; i < width; i ++ ) {
    for ( var j = 0; j < length; j ++ ) {
      var u = i / width;
      var v = j / length;
      var x = u - 0.5;
      var y = ( Math.cos( u * Math.PI * 4 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
      var z = v - 0.5;
      positions[ 3 * k ] = x;
      positions[ 3 * k + 1 ] = y;
      positions[ 3 * k + 2 ] = z;
      var intensity = ( y + 0.1 ) * 5;
      colors[ 3 * k ] = color.r * intensity;
      colors[ 3 * k + 1 ] = color.g * intensity;
      colors[ 3 * k + 2 ] = color.b * intensity;
      k ++;
    }
  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  geometry.computeBoundingBox();
  return geometry;
}
function generatePointcloud( color, width, length ) {
  var geometry = generatePointCloudGeometry( color, width, length );
  var material = new THREE.PointsMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
  return new THREE.Points( geometry, material );
}
function generateIndexedPointcloud( color, width, length ) {
  var geometry = generatePointCloudGeometry( color, width, length );
  var numPoints = width * length;
  var indices = new Uint16Array( numPoints );
  var k = 0;
  for ( var i = 0; i < width; i ++ ) {
    for ( var j = 0; j < length; j ++ ) {
      indices[ k ] = k;
      k ++;
    }
  }
  geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  var material = new THREE.PointsMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
  return new THREE.Points( geometry, material );
}
function generateIndexedWithOffsetPointcloud( color, width, length ) {
  var geometry = generatePointCloudGeometry( color, width, length );
  var numPoints = width * length;
  var indices = new Uint16Array( numPoints );
  var k = 0;
  for ( var i = 0; i < width; i ++ ) {
    for ( var j = 0; j < length; j ++ ) {
      indices[ k ] = k;
      k ++;
    }
  }
  geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  geometry.addGroup( 0, indices.length );
  var material = new THREE.PointsMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
  return new THREE.Points( geometry, material );
}


//SCENE UPDATE
export const getNewThreeScene = (addObject) => {
  scene = new THREE.Scene();

  var pcBuffer = generatePointcloud( new THREE.Color( 1, 0, 0 ), width, length );
  pcBuffer.scale.set( 5, 10, 20 );
  pcBuffer.position.set( - 10, 0, 0 );
  //scene.add( pcBuffer );
  var pcIndexed = generateIndexedPointcloud( new THREE.Color( 0, 1, 0 ), width, length );
  pcIndexed.scale.set( 5, 10, 20 );
  pcIndexed.position.set( 0, 0, 0 );
  //scene.add( pcIndexed );
  var pcIndexedOffset = generateIndexedWithOffsetPointcloud( new THREE.Color( 0, 1, 1 ), width, length );
  pcIndexedOffset.scale.set( 5, 10, 20 );
  pcIndexedOffset.position.set( 10, 0, 0 );
  //scene.add( pcIndexedOffset );
  pointclouds = [ pcBuffer, pcIndexed, pcIndexedOffset ];

  var particles = new THREE.Group();
  particles.add(pcBuffer);
  particles.add(pcIndexed);
  particles.add(pcIndexedOffset);
  particles.name = 'Particles';
  scene.add( particles );

  //adding particles to redux objects
  addObject(particles.id, particles.name, TREBLE, 80);  

  //
  var sphereGeometry = new THREE.SphereBufferGeometry( 0.1, 32, 32 );
  var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  for ( var i = 0; i < 40; i ++ ) {
    var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add( sphere );
    spheres.push( sphere );
        }
        
        
        return scene

};

*/