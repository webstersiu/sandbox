import { SphereGeometry, Mesh, MeshStandardMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import Base from './Base.js';

class Snowman extends Base {
    constructor() {
        super();
        
        let geo = new SphereGeometry(0, 0, 0); 
        let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
    
        for(let i = 0; i < count; i++) {
            const head = new SphereGeometry(1.2, 7, 7);
            const body = new SphereGeometry(1.5, 7, 7);
            
            head.translate(0, Math.random() * 0.3, 0);
            body.translate(0, Math.random() * 0.3, 0);
        
            const snowman = mergeBufferGeometries([head, body]);
            snowman.translate( 
                Math.random() * 20 - 10, 
                Math.random() * 7 + 7
            );
            snowman.rotateY(Math.random() * Math.PI * 2);
        
            geo = mergeBufferGeometries([geo, snowman]);
        }
        
        const mesh = new Mesh(
            geo,
            new MeshStandardMaterial({
                // envMap: this.envmap, 
                // envMapIntensity: 0.75, 
                flatShading: true,
                transparent: true,
                opacity: 0.95,
            })
        );
    }
}

export default Snowman;