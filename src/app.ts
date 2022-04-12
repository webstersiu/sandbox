import { Scene, Layers, PerspectiveCamera, WebGLRenderer, PointLight, Color } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';

import Land from './components/Land.js';
import Floor from './components/Floor.js';
import Foundation from './components/Foundation.js';

import Sun from './components/Sun.js';
import PreProcessing from './components/PreProcessing.js';
import { PostProcessing, disposeMaterial, renderBloom } from './components/PostProcessing.js';
import Background from './components/Background.js';
import Moon from './components/Moon.js';
import Star from './components/Star.js';

const bloomLayer = new Layers();
const scene = new Scene();

const preProcessing = new PreProcessing(scene);
let renderer = preProcessing.getRenderer();
const controls = preProcessing.getControl();
const camera = preProcessing.getCamera();

// const bloomComposer = new EffectComposer( preProcessing.getRenderer());
// const finalComposer = new EffectComposer( preProcessing.getRenderer());
// PostProcessing(scene, preProcessing.getCamera(), preProcessing.getRenderer(), bloomLayer, finalComposer, bloomComposer);

new Background().deploy(scene);

// scene.add(new Floor().deploy());
// new Sun().deploy(scene);
// new Moon().deploy(scene);
// new Star().deploy(scene);
scene.add(new Land().deploy());
// scene.add(new Foundation().deploy());
// scene.add(new Floor().deploy());
    
// scene.traverse( disposeMaterial );

// function render(){
//     // renderBloom(scene, bloomComposer, bloomLayer, preProcessing.getRenderer());
//     finalComposer.render();
//     requestAnimationFrame(render);
// }
// render();

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

render();
