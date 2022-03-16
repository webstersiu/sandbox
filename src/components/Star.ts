import { Mesh, Color,  IcosahedronGeometry, MeshPhysicalMaterial, FrontSide, 
    Vector2, Shape, ExtrudeGeometry, MeshLambertMaterial} from 'https://cdn.skypack.dev/three@0.137';
import Base from './Base.js'

class Star extends Base {
    star: Mesh;
    constructor() {
        super();
        
        const extrudeSettings2 = {
            steps: 200,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0.2,
            bevelSegments: 25
        };


        const pts2 = [], numPts = 5;

        for ( let i = 0; i < numPts * 2; i ++ ) {

            const l = i % 2 == 1 ? 0.5 : 0.25;

            const a = i / numPts * Math.PI;

            pts2.push( new Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );

        }

        const shape2 = new Shape( pts2 );

        const geometry2 = new ExtrudeGeometry( shape2, extrudeSettings2 );

        const material2 = new MeshLambertMaterial( { color: 0xff8000, wireframe: false } );

        this.star = new Mesh( geometry2, material2 );


        this.star.position.set(0, 10, 2);
        
    }

    deploy(scene)
    {
        scene.add(this.star);
        this.star.layers.enable(1); 
    }
}

export default Star;
