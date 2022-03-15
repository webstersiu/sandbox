import { BufferGeometry, CylinderGeometry, BoxGeometry } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

class House{
    house: BufferGeometry;
    
    constructor(height: number, position: any) {
        let treeHeight = 1.25;
        const geo = new CylinderGeometry(0, 1, treeHeight, 4);
        geo.rotateY(90);
        geo.translate(position.x, height + treeHeight * 1.25 + 1, position.y);
        
        const geo2 = new BoxGeometry(0.8, treeHeight, 1.15);
        geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);

        this.house = mergeBufferGeometries([geo, geo2]);
    }

    deploy() {
        return this.house;
    }
}

export default House;