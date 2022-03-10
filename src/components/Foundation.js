import { CylinderGeometry, DoubleSide, Mesh, MeshPhysicalMaterial } from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js'

class Foundation extends Base{
    constructor(){
        super();
        
        this.mapContainer = new Mesh(
            new CylinderGeometry(17.1, 17.1, this.MAX_HEIGHT * 0.15, 50, 1, true),
            new MeshPhysicalMaterial({
                map: this.textures.dirt,
                side: DoubleSide,
            })
        );
        this.mapContainer.receiveShadow = true;
        this.mapContainer.rotation.y = -Math.PI * 0.333 * 0.5;
        this.mapContainer.position.set(0, this.MAX_HEIGHT, 0);
    }

    deploy() {
        return this.mapContainer;
    }
}

export default Foundation;