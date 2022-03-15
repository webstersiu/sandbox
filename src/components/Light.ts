import { PointLight, 
    HemisphereLight, DirectionalLight, AmbientLight, Scene,
    HemisphereLightHelper, DirectionalLightHelper } from 'https://cdn.skypack.dev/three@0.137';

class Light{
    light: DirectionalLight;
    constructor() {        
        this.light = new DirectionalLight( 0xffffff, 10 );
        this.light.color.setHSL( 0.1, 1, 0.95 );
        this.light.position.set( - 1, 1.75, 1 );
        this.light.position.multiplyScalar( 30 );

        this.light.castShadow = true;
        this.light.receiveShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;

        const d = 50;

        this.light.shadow.camera.left = - d;
        this.light.shadow.camera.right = d;
        this.light.shadow.camera.top = d;
        this.light.shadow.camera.bottom = - d;

        this.light.shadow.camera.far = 3500;
        this.light.shadow.bias = - 0.0001;
    }

    deploy(scene: Scene, enableHelper: boolean) {
        if (enableHelper)
            scene.add( new DirectionalLightHelper( this.light, 5 ) );
        scene.add(this.light);
    }
}

class AmbLight{
    light: AmbientLight;

    constructor() {

        this.light = new AmbientLight(0xffffff, 0.5)
    }
    
    deploy(scene: Scene) {
        scene.add(this.light);
    }
}

class EnvironmentLight{
    light: HemisphereLight;
    constructor() {

        this.light = new HemisphereLight( 0xffffff, 0xffffff, 8 );
        this.light.color.setHSL( 0.6, 1, 0.6 );
        this.light.groundColor.setHSL( 0.095, 1, 0.75 );
        this.light.position.set( 0, 40, 0 );
    }
    
    deploy(scene: Scene, enableHelper: boolean) {
        if (enableHelper)
            scene.add( new HemisphereLightHelper( this.light, 5 ) );
        scene.add(this.light);
    }
}

export default {Light, EnvironmentLight, AmbLight}