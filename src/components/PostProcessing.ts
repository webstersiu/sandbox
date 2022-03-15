import { Color, Layers, Vector2, WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, MeshBasicMaterial, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { RenderPass} from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass';
import { EffectComposer } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer';
import { ShaderPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass';

let BLOOM_SCENE = 1;
let bloom_pass_params = {
        exposure: 1,
        bloomStrength: 2.5,
        bloomThreshold: 0,
        bloomRadius: 0
      };
var materialShaders = [];
var materialInst = [];
var materials = {};
var darkMaterial = createMaterial("basic", 0x000000, 0, false);

export function PostProcessing(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, bloomLayer: Layers, finalComposer: any, bloomComposer: any){
    bloomLayer.set(BLOOM_SCENE);
    let renderScene = new RenderPass( scene, camera );
    let bloomPass = new UnrealBloomPass( new Vector2( innerWidth, innerHeight ), 1.5, 0.4, 0.85 );
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
  rednerer.setClearColor(new Color().setHSL( 0.6, 0, 0.5 ));
  } );
  
}

export function disposeMaterial( obj ) {

    if ( obj.material ) {

        obj.material.dispose();

    }

}

function createMaterial(type, color, isTip, changeColor) {
    let mat =
      type == "basic"
        ? new MeshBasicMaterial()
        : new MeshStandardMaterial();
  
    mat.color.set(color);
    // if (type == "standard") {
    //   mat.metalness = 0.25;
    //   mat.roughness = 0.75;
    // }
  
    mat.onBeforeCompile = function(shader) {
      shader.uniforms.time = { value: 1.0 };
      shader.uniforms.isTip = { value: 0.0 };
  
      var noise = `
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 permute(vec4 x) {
           return mod289(((x*34.0)+1.0)*x);
      }
      
      vec4 taylorInvSqrt(vec4 r)
      {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      
      float snoise(vec3 v)
        { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
      
        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
      
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
      
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
      
        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
      
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
      
      //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
      
      // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }
      `;


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