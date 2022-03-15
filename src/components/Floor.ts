import { CylinderGeometry, DoubleSide, Mesh, MeshPhysicalMaterial } from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js'

class Floor extends Base {
    mapFloor: Mesh;
    constructor() {
        super();

        this.mapFloor = new Mesh(
            new CylinderGeometry(10.5, 10.5, this.MAX_HEIGHT * 0.1, 50),
            new MeshPhysicalMaterial({
                map: this.textures.dirt2,
                side: DoubleSide,
            })
        );
        this.mapFloor.receiveShadow = true;
        this.mapFloor.position.set(0, -this.MAX_HEIGHT * 0.05, 0);
    }

    deploy() {
        return this.mapFloor;
    }
}

export default Floor;