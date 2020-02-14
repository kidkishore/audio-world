import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbitcontrols';
import {BASS, LOMID, TREBLE} from '../constants';

export var threeCanvas;

//INITIAL CAMERA AND RENDERER
export const getThreeCameraAndRenderer = () => {
    const bottomNavigation = 0;
    const camera = new THREE.PerspectiveCamera(75, window.visualViewport.width / (window.visualViewport.height-bottomNavigation), 0.01, 1500);
    camera.position.y = 0.2;
    camera.position.z = 5;

    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.visualViewport.width, window.visualViewport.height-bottomNavigation);
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
    console.log('getting three scene')





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
      //addText(scene, addObject);

    });




  //////////*************Creating Center******************///////////

  import('../models/' + initialCenter + '.glb')
  .then(newModule => {
    geometry = new THREE.SphereGeometry(1, 40, 40);
    loadObj( initialCenter ,"Center", newModule.default, scene, addObject);    /************ Adding object 1************/
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
      addObject(orbitDir.id, initialOrbit, orbitDir.name, TREBLE, 80);        /************ Adding object 3************/
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

const addText = (scene, addObject) => {

  //////////*************Creating Text******************///////////

  THREE.Cache.enabled = true;

  var container, stats, permalink, hex;

  var camera, cameraTarget, scene, renderer;

  var group, textMesh1, textMesh2, textGeo, materials;

  var firstLetter = true;

  var text = "three.js",

    height = 20,
    size = 70,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5,
    bevelEnabled = true,

    font = undefined,

    fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold"; // normal bold

    var mirror = true;

    group = new THREE.Group();
    //group.position.y = 100;

    

    var file = "square_font"

    import('../models/' + file + '.json')
     .then(newModule => {
      var loader = new THREE.FontLoader(); 
      var font = loader.parse(newModule.default); 


      var textGeometry1 = new THREE.TextGeometry( 'AUDIOWORLD.IO', 
      {
         font: font, 
         size: 0.3, 
         height: 0.1, 
         curveSegments: 20,
         bevelEnabled: true,
         bevelThickness: 0.01,
         bevelSize: 0.01
        } ); 

        var textGeometry2 = new THREE.TextGeometry( '2CUPSHORTY.BEATS', 
      {
         font: font, 
         size: 0.3, 
         height: 0.1, 
         curveSegments: 20,
         bevelEnabled: true,
         bevelThickness: 0.01,
         bevelSize: 0.01
        } ); 

        var textGeometry3 = new THREE.TextGeometry( 'VELVEETA', 
      {
         font: font, 
         size: 0.3, 
         height: 0.1, 
         curveSegments: 20,
         bevelEnabled: true,
         bevelThickness: 0.01,
         bevelSize: 0.01
        } ); 
      var textMaterial = new THREE.MeshPhongMaterial( { color: 0xF30100, ambient: 0x330300, shininess: 30 } ); 
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

      textMesh1.position.set(-1.3, 0, 2); //audio
      textMesh2.position.set(2.4, 0, 0.4); //2cup
      textMesh3.position.set(-1.5, 0, -2); //vel


      modify(direction, axis, angle1, textMesh1.geometry );
      modify(direction, axis, angle2, textMesh2.geometry );
      modify(direction, axis, angle3, textMesh3.geometry );



 


      group.add(textMesh1)
      group.add(textMesh2)
      group.add(textMesh3)
     })

     group.name = 'Text';


     scene.add( group );
     addObject(group.id, 'Text', group.name, -1 , 200);

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