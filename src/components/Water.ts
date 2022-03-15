import { Color, CylinderGeometry, BoxGeometry, RepeatWrapping, Mesh, MeshPhysicalMaterial, Vector2, BufferGeometry } from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js';

class Water extends Base{
    waterMesh:Mesh;

    constructor(height: number, position: any) {
        super();
    }

    applyTexture(geo:BufferGeometry) {
        let waterTexture = this.textures.water;
        waterTexture.wrapS = RepeatWrapping;
        waterTexture.wrapT = RepeatWrapping;

        let mesh = new Mesh(
            geo, 
            new MeshPhysicalMaterial({
                color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
                ior: 1.4,
                transmission: 1,
                transparent: true,
                roughness: 0.5,
                metalness: 0.025,
                roughnessMap: waterTexture,
                metalnessMap: waterTexture,
            })
        );
        mesh.receiveShadow = true;
        return mesh;
    }

    deploy() {
        return this.waterMesh;
    }
}

export default Water;