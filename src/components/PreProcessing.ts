import { PerspectiveCamera, Scene, WebGLRenderer,ReinhardToneMapping,PCFSoftShadowMap, EventDispatcher, HemisphereLight } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import Light from './Light.js';

class PreProcessing {

    private camera : PerspectiveCamera;
    private renderer : WebGLRenderer;
    private controls : EventDispatcher;

    public getCamera(): PerspectiveCamera{
        return this.camera;
    }

    public getRenderer(): WebGLRenderer{
        return this.renderer;
    }

    public getOrbitControls(): EventDispatcher{
        return this.controls;
    }


    
    constructor(scene: Scene) {
        // setup the main camera of the world

        this.camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 200);
        this.camera.position.set(0,10,20);

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.toneMapping = ReinhardToneMapping;
        this.renderer.setClearColor(0x000000);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // new Light.EnvironmentLight().deploy(scene, true);

        new Light.AmbLight().deploy(scene);
        
        new Light.Light().deploy(scene, true);
    }

    
}

export default PreProcessing;