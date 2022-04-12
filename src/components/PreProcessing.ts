import { PerspectiveCamera, Scene, WebGLRenderer,ReinhardToneMapping,PCFSoftShadowMap, EventDispatcher, HemisphereLight, AxesHelper } from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import Light from './Light.js';

class PreProcessing {

    private camera : PerspectiveCamera;
    private renderer : WebGLRenderer;
    private controls : any;

    private DEBUG_MODE: boolean = true;

    public getCamera(): PerspectiveCamera{
        return this.camera;
    }

    public getRenderer(): WebGLRenderer{
        return this.renderer;
    }

    // public getOrbitControls(): EventDispatcher{
    //     return this.controls;
    // }

    public getControl(): any {
        return this.controls;
    }

    
    constructor(scene: Scene) {
        // setup the main camera of the world

        this.camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 200);
        this.camera.position.set(30,50,50);

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.toneMapping = ReinhardToneMapping;
        //this.renderer.setClearColor(0x000000);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);


        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0,0,0);
        this.controls.dampingFactor = 0.05;
        this.controls.enableDamping = true;
        
        if (this.DEBUG_MODE) {
            // for debugging
            let axes = new AxesHelper(20);
            scene.add(axes);
        }

        //new Light.EnvironmentLight().deploy(scene, this.DEBUG_MODE);

        // new Light.AmbLight().deploy(scene);
        
        new Light.Light().deploy(scene, this.DEBUG_MODE);
    }
}

export default PreProcessing;