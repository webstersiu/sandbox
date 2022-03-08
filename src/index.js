import { 
    WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, 
    Color, PointLight, PerspectiveCamera,
    Scene, PMREMGenerator, PCFSoftShadowMap,
  } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import Land from './components/Land.js';
import Cloud from './components/Cloud.js';
import Water from './components/Water.js';
import Floor from './components/Floor.js';
import Foundation from './components/Foundation.js';
import Light from './components/Light.js';

const scene = new Scene();
scene.background = new Color("#FFEECC");

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(-17,31,33);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

(async function() {
    new Land().deploy(scene);
    scene.add(new Foundation().deploy());
    scene.add(new Floor().deploy());

    scene.add(new Water().deploy());
    scene.add(new Light().deploy());
    
    // Cloud
    let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
    for(let i = 0; i < count; i++) {
        scene.add(new Cloud().deploy());
    }
  
    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
})();
  