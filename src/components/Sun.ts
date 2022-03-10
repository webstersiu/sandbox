import { Mesh, Color,  IcosahedronGeometry, MeshBasicMaterial} from 'https://cdn.skypack.dev/three@0.137';


class Sun {
    sun: Mesh;
    constructor() {
        //sun object
        const color = new Color("#FDB000");
        const geometry = new IcosahedronGeometry(3, 3);
        const material = new MeshBasicMaterial({ color: color });
        this.sun = new Mesh(geometry, material);
        this.sun.position.set(0, 18, 0);
        
    }

    deploy(scene, camera)
    {
        scene.add(this.sun);
        this.sun.layers.enable(1); 
    }
}

export default Sun;
