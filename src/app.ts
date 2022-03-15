import { Color,Scene, Layers ,PlaneGeometry, MeshLambertMaterial ,Mesh, Fog } from 'https://cdn.skypack.dev/three@0.137';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';

import Land from './components/Land.js';
import Floor from './components/Floor.js';
import Foundation from './components/Foundation.js';

import Sun from './components/Sun.js';
import PreProcessing from './components/PreProcessing.js';
import { PostProcessing, disposeMaterial, renderBloom } from './components/PostProcessing.js';
import Background from './components/Background.js';
import Moon from './components/Moon.js';

const bloomLayer = new Layers();
const scene = new Scene();

const preProcessing = new PreProcessing(scene);
const bloomComposer = new EffectComposer( preProcessing.getRenderer() );
const finalComposer = new EffectComposer( preProcessing.getRenderer());
PostProcessing(scene, preProcessing.getCamera(), preProcessing.getRenderer(), bloomLayer, finalComposer, bloomComposer);


new Background().deploy(scene);

// scene.add(new Floor().deploy());
//new Sun().deploy(scene);
new Moon().deploy(scene);

(async function() {
    scene.add(new Land().deploy());
    // scene.add(new Foundation().deploy());
    // scene.add(new Floor().deploy());
    
    scene.traverse( disposeMaterial );
    preProcessing.getRenderer().setAnimationLoop(() => {
        renderBloom(scene, bloomComposer, bloomLayer, preProcessing.getRenderer());
        finalComposer.render();
    });
})();