// First, let TypeScript allow all module names starting with "https://". This will suppress TS errors.
declare module 'https://*';

// Second, list out all your dependencies. For every URL, you must map it to its local module.
declare module 'https://cdn.skypack.dev/three@0.137' {
  export { 
    WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, Color, PerspectiveCamera, Scene, PCFSoftShadowMap, PointLight, DoubleSide,
    RepeatWrapping, CylinderGeometry, TextureLoader, SphereGeometry, BoxGeometry, BufferGeometry,
    Mesh, MeshStandardMaterial, MeshPhysicalMaterial, Vector2, Layers,
    ShaderMaterial, MeshBasicMaterial,ReinhardToneMapping,
    HemisphereLight, DirectionalLight,  AmbientLight, HemisphereLightHelper, DirectionalLightHelper} from 'three';
}

declare module 'https://cdn.skypack.dev/simplex-noise';

// declare module 'https://cdn.skypack.dev/three-stdlib@2.8.5' {
//   export * from 'three-stdlib';
// }
// declare module 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls' {
//   export { OrbitControls } from 'three-stdlib';
// }

// declare module 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils' {
//   export { mergeBufferGeometries } from 'three-stdlib';
// }

