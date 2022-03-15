import { BufferGeometry, SphereGeometry, Mesh, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

class Cloud {
    cloudGeo: BufferGeometry;

    constructor(height: number, position: any) {
        const cloudGeo = new SphereGeometry(0, 0, 0); 
        
        const puff1 = new SphereGeometry(1.2, 7, 7);
        const puff2 = new SphereGeometry(1.5, 7, 7);
        const puff3 = new SphereGeometry(0.9, 7, 7);
        
        puff1.translate(-1.85, Math.random() * 0.3, 0);
        puff2.translate(0, Math.random() * 0.3, 0);
        puff3.translate(1.85, Math.random() * 0.3, 0);
    
        this.cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
        this.cloudGeo.translate(position.x, height + 5, position.y);
        this.cloudGeo.rotateY(Math.random() * Math.PI * 2);
    }

    deploy() {
        return new Mesh(
            this.cloudGeo,
            new MeshStandardMaterial({
                flatShading: true,
                transparent: true,
                opacity: 0.95,
            })
        );
    }
}

export default Cloud;