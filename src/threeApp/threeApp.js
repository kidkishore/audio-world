import * as THREE from 'three';
import 'babel-polyfill';
import OrbitControls from 'three-orbitcontrols';

export var threeCanvas;
export var threeScene;

//INITIAL CAMERA AND RENDERER
export const getThreeCameraAndRenderer = () => {
    const bottomNavigation = 0;

    var width = window.innerWidth;
    var height = window.innerHeight;
    const screenWidth = screen.width;
    //console.log('width, height: ', width, height)
    //console.log('screenWidth: ', screenWidth)

    if(screenWidth < 420){
      width = screen.width;
      height = screen.height;
    }

    const camera = new THREE.PerspectiveCamera(75, width / (height-bottomNavigation), 0.01, 1500);
    camera.position.y = 0.5;
    camera.position.z = 5;

    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width , height -bottomNavigation);
    container.appendChild(renderer.domElement);
    threeCanvas = renderer.domElement;

    var controls = new OrbitControls(camera, renderer.domElement);


    return [camera, renderer, controls];


}

//SCENE UPDATE
export const getThreeScene = (initialBackground, initialCenter, initialOrbit, addObject) => {

  threeScene = new THREE.Scene();

  //lights
  var ambientLight = new THREE.AmbientLight(0xffffff, 5);
  ambientLight.position.set(-1, -1, -1).normalize();
  //scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(10, 0, 10).normalize();
  threeScene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(-10, 0, -10).normalize();
  threeScene.add(directionalLight);

  return threeScene;
}