import { Color, Layers, Vector2, WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, MeshBasicMaterial, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { RenderPass} from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';
import { ShaderPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass';

let BLOOM_SCENE = 1;
let bloom_pass_params = {
        exposure: 0.5,
        bloomStrength: 2,
        bloomThreshold: 0,
        bloomRadius: 0
      };
var materialShaders = [];
var materialInst = [];
var materials = {};
var darkMaterial = new MeshBasicMaterial( { color: 'black' } );

export function PostProcessing(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, bloomLayer: Layers, finalComposer: any, bloomComposer: any){
    bloomLayer.set(BLOOM_SCENE);

    let renderScene = new RenderPass( scene, camera );
    let bloomPass = new UnrealBloomPass( new Vector2( innerWidth, innerHeight ), 0, 0, 0 );
    bloomPass.exposure = bloom_pass_params.exposure;
    bloomPass.threshold = bloom_pass_params.bloomThreshold;
    bloomPass.strength = bloom_pass_params.bloomStrength;
    bloomPass.radius = bloom_pass_params.bloomRadius;
    
    
    bloomComposer.renderToScreen = false;
    bloomComposer.setSize(innerWidth * window.devicePixelRatio, innerHeight * window.devicePixelRatio);
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );

    let finalPass = new ShaderPass(
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

    finalComposer.setSize(
        innerWidth * window.devicePixelRatio,
        innerHeight * window.devicePixelRatio
    );
    finalComposer.addPass( renderScene);
    finalComposer.addPass( finalPass );
}

export function renderBloom(scene: Scene, bloomComposer: any, bloomLayer: Layers, rednerer: WebGLRenderer) {
  scene.traverse( (obj: any) => {
    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

      materials[ obj.uuid ] = obj.material;
      obj.material = darkMaterial;
    }
    rednerer.setClearColor(0x000000);
    });
  bloomComposer.render();
  scene.traverse( (obj: any) => {
    if ( materials[ obj.uuid ] ) {

      obj.material = materials[ obj.uuid ];
      delete materials[ obj.uuid ];

  }

  rednerer.setClearColor(new Color().setHSL( 0.6, 0, 1 ));
  } );
  
}

export function disposeMaterial( obj ) {

    if ( obj.material ) {

        obj.material.dispose();

    }

}