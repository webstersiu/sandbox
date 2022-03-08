import { SphereGeometry, Mesh, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

class Cloud {
    constructor() {
        this.geo = new SphereGeometry(0, 0, 0); 
        
        const puff1 = new SphereGeometry(1.2, 7, 7);
        const puff2 = new SphereGeometry(1.5, 7, 7);
        const puff3 = new SphereGeometry(0.9, 7, 7);
        
        puff1.translate(-1.85, Math.random() * 0.3, 0);
        puff2.translate(0,     Math.random() * 0.3, 0);
        puff3.translate(1.85,  Math.random() * 0.3, 0);
    
        const cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
        cloudGeo.translate( 
            Math.random() * 20 - 10, 
            Math.random() * 7 + 7, 
            Math.random() * 20 - 10
        );
        cloudGeo.rotateY(Math.random() * Math.PI * 2);
    
        this.geo = mergeBufferGeometries([this.geo, cloudGeo]);
    }

    deploy() {
        return new Mesh(
            this.geo,
            new MeshStandardMaterial({
                flatShading: true,
                transparent: true,
                opacity: 0.85,
            })
        );
    }
}

export default Cloud;