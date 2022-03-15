import { Scene, Layers  } from 'https://cdn.skypack.dev/three@0.137';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';

import Land from './components/Land.js';
import Cloud from './components/Cloud.js';
import Water from './components/Water.js';
import Floor from './components/Floor.js';
import Foundation from './components/Foundation.js';

import Sun from './components/Sun.js';
import PreProcessing from './components/PreProcessing.js';
import { PostProcessing, disposeMaterial, renderBloom } from './components/PostProcessing.js';

const bloomLayer = new Layers();
const scene = new Scene();
const preProcessing = new PreProcessing(scene);
const bloomComposer = new EffectComposer( preProcessing.getRenderer() );
const finalComposer = new EffectComposer( preProcessing.getRenderer());
PostProcessing(scene, preProcessing.getCamera(), preProcessing.getRenderer(), bloomLayer, finalComposer, bloomComposer);

scene.add(new Water().deploy());
new Sun().deploy(scene, preProcessing.getCamera());

// Cloud
let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
let clouds = [];
for(let i = 0; i < count; i++) {
    clouds.push(new Cloud());
    scene.add(clouds[clouds.length - 1].deploy());
}

(async function() {
    scene.traverse( disposeMaterial );
    preProcessing.getRenderer().setAnimationLoop(() => {
        renderBloom(scene, bloomComposer, bloomLayer, preProcessing.getRenderer());
        finalComposer.render();
    });
})();