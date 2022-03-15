import { Mesh, Color,  IcosahedronGeometry, MeshBasicMaterial, MeshPhysicalMaterial, FrontSide} from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js'

class Moon extends Base {
    moon: Mesh;
    constructor() {
        super();
        //sun object
        const color = new Color("#FDB000");
        const geometry = new IcosahedronGeometry(2, 10);
        const material = new MeshPhysicalMaterial({
            map: this.textures.moon,
            side: FrontSide,
            color: new Color().setHex(0xf7eeb5),
            roughness: 0.5
        });
        this.moon = new Mesh(geometry, material);
        this.moon.position.set(10, 15, 10);
        
    }

    deploy(scene)
    {
        scene.add(this.moon);
        this.moon.layers.enable(1); 
    }
}

export default Moon;
