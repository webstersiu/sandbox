// First, let TypeScript allow all module names starting with "https://". This will suppress TS errors.
declare module 'https://*';

// Second, list out all your dependencies. For every URL, you must map it to its local module.
declare module 'https://cdn.skypack.dev/three@0.137' {
  export { 
    BackSide, FrontSide, DoubleSide,
    ReinhardToneMapping, 
    WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, Color, PerspectiveCamera, Scene, PCFSoftShadowMap,RepeatWrapping, Fog, 
    Mesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshLambertMaterial, ShaderMaterial, MeshBasicMaterial, TextureLoader, 
    Vector2, Layers, EventDispatcher, Shape, ExtrudeGeometry, 
    CylinderGeometry, SphereGeometry, BoxGeometry, IcosahedronGeometry,PlaneGeometry, BufferGeometry,
    HemisphereLight, DirectionalLight,  AmbientLight, PointLight,
    HemisphereLightHelper, DirectionalLightHelper, Group} from 'three';
}

declare module 'https://cdn.skypack.dev/simplex-noise';
