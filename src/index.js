import { 
    WebGLRenderer, 
    Color, PerspectiveCamera, MeshStandardMaterial,
    Scene, PCFSoftShadowMap, 
    Layers, Vector2, ShaderMaterial, MeshBasicMaterial, ReinhardToneMapping
  } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { RenderPass} from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';
import { ShaderPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass';

import Land from './components/Land.js';
import Cloud from './components/Cloud.js';
import Water from './components/Water.js';
import Floor from './components/Floor.js';
import Foundation from './components/Foundation.js';
import Light from './components/Light.js';
import Sun from './components/Sun.js';

var materialShaders = [];
var materialInst = [];
var darkMaterial = createMaterial("basic", 0x000000, 0, false);
var materials = {};
var params = {
  exposure: 1,
  bloomStrength: 2.5,
  bloomThreshold: 0,
  bloomRadius: 0
};
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
var bloomLayer = new Layers();
bloomLayer.set(BLOOM_SCENE);

const scene = new Scene();

const camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 200);
camera.position.set(0,10,20);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ReinhardToneMapping;
//renderer.toneMappingExposure = Math.pow(params.exposure, 4.0);
renderer.setClearColor(0x000000);
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new Vector2( innerWidth, innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.setSize(innerWidth * window.devicePixelRatio, innerHeight * window.devicePixelRatio);
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
    new ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), 'baseTexture'
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer );
finalComposer.setSize(
    innerWidth * window.devicePixelRatio,
    innerHeight * window.devicePixelRatio
  );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

const controls = new OrbitControls(camera, renderer.domElement);


    new Light.AmbLight().deploy(scene);
    new Light.EnvironmentLight().deploy(scene, false);
    new Light.Light().deploy(scene, false);


    

    new Land().deploy(scene);
    //scene.add(new Foundation().deploy());
    scene.add(new Floor().deploy());
    scene.add(new Water().deploy());
    new Sun().deploy(scene, camera);
    // Cloud
    let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
    let clouds = [];
    for(let i = 0; i < count; i++) {
        clouds.push(new Cloud());
        scene.add(clouds[clouds.length - 1].deploy());
    }
  


(async function() {
    scene.traverse( disposeMaterial );
    renderer.setAnimationLoop(() => {
        renderBloom();
        finalComposer.render();
    });
})();


function disposeMaterial( obj ) {

    if ( obj.material ) {

        obj.material.dispose();

    }

}
function renderBloom() {
    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );
    
}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
    }
    renderer.setClearColor(0x000000);
}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }
    renderer.setClearColor(new Color().setHSL( 0.6, 0, 0.5 ));
}

function createMaterial(type, color, isTip, changeColor) {
    let mat =
      type == "basic"
        ? new MeshBasicMaterial()
        : new MeshStandardMaterial();
  
    mat.color.set(color);
    if (type == "standard") {
      mat.metalness = 0.25;
      mat.roughness = 0.75;
    }
  
    mat.onBeforeCompile = function(shader) {
      shader.uniforms.time = { value: 1.0 };
      shader.uniforms.isTip = { value: 0.0 };
  
      shader.vertexShader =
        `uniform float time;
       uniform float isTip;
       attribute vec3 instPosition;
       attribute vec2 instUv;
      ` +
        noise + // see the script in the html-section
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `
        vec3 transformed = vec3( position );
  
        vec3 ip = instPosition;
        vec2 iUv = instUv;
        iUv.y += time * 0.125;
        iUv *= vec2(3.14);
        float wave = snoise( vec3( iUv, 0.0 ) );
  
        ip.y = wave * 3.5;
        float lim = 2.0;
        bool tip = isTip < 0.5 ? ip.y > lim : ip.y <= lim;
        transformed *= tip ? 0.0 : 1.0;
  
        transformed = transformed + ip;
      `
      );
      materialShaders.push({
        id: "mat" + materialShaders.length,
        shader: shader,
        isTip: isTip,
        changeColor: changeColor
      });
      materialInst.push(mat);
    };
    
    return mat;
  }