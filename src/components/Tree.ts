import { BufferGeometry, CylinderGeometry } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

class Tree{
    tree: BufferGeometry;
    
    constructor(height: number, position: any) {
        let treeHeight = Math.random() * 1 + 1.25;
        const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
        geo.translate(position.x, height + treeHeight * 0 + 1, position.y);
        
        const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
        geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);
        
        const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
        geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);

        this.tree = mergeBufferGeometries([geo, geo2, geo3]);
    }

    deploy() {
        return this.tree;
    }
}

export default Tree;