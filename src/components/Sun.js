import { SphereGeometry, Mesh, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';

let geo = new SphereGeometry(1, 20, 20); 
class Sun {
    constructor() {
        geo.translate(10, 20, 10);
        const mesh = new Mesh(
            geo,
            new MeshStandardMaterial({
                flatShading: false,
                transparent: true,
                opacity: 0.95,
            })
        );
    }
}

export default Sun;
