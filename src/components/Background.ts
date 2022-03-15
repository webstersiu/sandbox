import { Scene, Color, PlaneGeometry, Mesh, 
    MeshLambertMaterial, HemisphereLight, SphereGeometry,
    ShaderMaterial, BackSide } from 'https://cdn.skypack.dev/three@0.137';

class Background{
    ground: Mesh;


    constructor(){
        // GROUND
        const groundGeo = new PlaneGeometry( 10000, 10000 );
        const groundMat = new MeshLambertMaterial( { color: 0xffffff } );
        groundMat.color.setHSL( 0.495, 1, 0.75 );

        this.ground = new Mesh( groundGeo, groundMat );
        this.ground.position.y = - 33;
        this.ground.rotation.x = - Math.PI / 2;
        this.ground.receiveShadow = true;


        
    }

    deploy(scene: Scene) {
        scene.add(this.ground)

    }
}

export default Background;