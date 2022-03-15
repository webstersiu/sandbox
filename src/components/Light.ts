import { Color, PointLight } from 'https://cdn.skypack.dev/three@0.137';

class Light{
    light: PointLight;
    
    constructor() {
        this.light = new PointLight( new Color("#FFCB8E").convertSRGBToLinear(), 80, 250 );
        this.light.position.set(10, 20, 10);

        this.light.castShadow = true; 
        this.light.shadow.mapSize.width = 512; 
        this.light.shadow.mapSize.height = 512; 
        this.light.shadow.camera.near = 0.5; 
        this.light.shadow.camera.far = 500; 
    }

    deploy() {
        return this.light;
    }
}

export default Light;