import { Color, CylinderGeometry, RepeatWrapping, Mesh, MeshPhysicalMaterial, Vector2, TextureLoader } from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js';

class Water extends Base{
    constructor() {
        super();
        
        let waterTexture = this.textures.water;
        waterTexture.repeat = new Vector2(1, 1);
        waterTexture.wrapS = RepeatWrapping;
        waterTexture.wrapT = RepeatWrapping;

        this.waterMesh = new Mesh(
            new CylinderGeometry(17, 17, this.MAX_HEIGHT * 0.2, 50),
            new MeshPhysicalMaterial({
                color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
                ior: 1.4,
                transmission: 1,
                transparent: true,
                thickness: 1.5,
                roughness: 1,
                metalness: 0.025,
                roughnessMap: waterTexture,
                metalnessMap: waterTexture,
            })
        );
        this.waterMesh.receiveShadow = true;
        this.waterMesh.rotation.y = -Math.PI * 0.333 * 0.5;
        this.waterMesh.position.set(0, this.MAX_HEIGHT * 0.1, 0);
    }

    deploy() {
        return this.waterMesh;
    }
}

export default Water;