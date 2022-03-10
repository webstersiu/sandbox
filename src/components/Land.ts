import { CylinderGeometry, BoxGeometry, Mesh, MeshPhysicalMaterial, Vector2, BufferGeometry, Scene } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise';
import Base from './Base.js';
import Tree from './Tree.js';
import Stone from './Stone.js';

class Land extends Base {
    _stoneGeo: BufferGeometry;
    _dirtGeo: BufferGeometry;
    _dirt2Geo: BufferGeometry;
    _sandGeo: BufferGeometry;
    _grassGeo: BufferGeometry;

    field: BoxGeometry;

    STONE_HEIGHT: number;
    DIRT_HEIGHT: number;
    GRASS_HEIGHT: number;
    SAND_HEIGHT: number;
    DIRT2_HEIGHT: number;

    constructor() {
        super();

        this._stoneGeo = new BoxGeometry(0,0,0);
        this._dirtGeo = new BoxGeometry(0,0,0);
        this._dirt2Geo = new BoxGeometry(0,0,0);
        this._sandGeo = new BoxGeometry(0,0,0);
        this._grassGeo = new BoxGeometry(0,0,0);

        this.field = new BoxGeometry(0,0,0);

        this.STONE_HEIGHT = this.MAX_HEIGHT * 0.8;
        this.DIRT_HEIGHT = this.MAX_HEIGHT * 0.7;
        this.GRASS_HEIGHT = this.MAX_HEIGHT * 0.5;
        this.SAND_HEIGHT = this.MAX_HEIGHT * 0.3;
        this.DIRT2_HEIGHT = this.MAX_HEIGHT * 0;

        this.gen();
    }
    
    hexGeometry(height:number, position:any) {
        let geo  = new CylinderGeometry(1, 1, height, 6, 1, false);
        geo.translate(position.x, height * 0.5, position.y);
      
        return geo;
    }

    hex(height:number, position:any) {
        let geo = this.hexGeometry(height, position);

        if(height > this.STONE_HEIGHT) {
            this._stoneGeo = mergeBufferGeometries([geo, this._stoneGeo]);
            if(Math.random() > 0.8) {
                this._stoneGeo = mergeBufferGeometries([this._stoneGeo, new Stone(height, position).deploy()]);
            }
        } else if(height > this.DIRT_HEIGHT) {
            this._dirtGeo = mergeBufferGeometries([geo, this._dirtGeo]);
            if(Math.random() > 0.8) {
                this._grassGeo = mergeBufferGeometries([this._grassGeo, new Tree(height, position).deploy()]);
            }
        } else if(height > this.GRASS_HEIGHT) {
            this._grassGeo = mergeBufferGeometries([geo, this._grassGeo]);
        } else if(height > this.SAND_HEIGHT) { 
            this._sandGeo = mergeBufferGeometries([geo, this._sandGeo]);
            if(Math.random() > 0.8 && this._stoneGeo) {
                this._stoneGeo = mergeBufferGeometries([this._stoneGeo, new Stone(height, position).deploy()]);
            }
        } else if(height > this.DIRT2_HEIGHT) {
            this._dirt2Geo = mergeBufferGeometries([geo, this._dirt2Geo]);
        } 
    }
      
    hexMesh(geo:BufferGeometry, map:any) {
        let mat = new MeshPhysicalMaterial({ 
            flatShading: true,
            map
        });
      
        let mesh = new Mesh(geo, mat);
        mesh.castShadow = true; //default is false
        mesh.receiveShadow = true; //default
      
        return mesh;
    }

    tileToPosition(tileX:number, tileY:number) {
        return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
    }

    gen() {
        const simplex = new SimplexNoise(); // optional seed as a string parameter

        // generate the foundation
        for(let i = -20; i <= 20; i++) {
            for(let j = -20; j <= 20; j++) {
                let position = this.tileToPosition(i, j);
        
                if(position.length() > 16) continue;
                
                let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
                noise = Math.pow(noise, 1.5);
        
                this.hex(noise * this.MAX_HEIGHT, position);
            }
        }
    }

    deploy(scene:Scene) {
        scene.add(this.hexMesh(this._stoneGeo, this.textures.stone));
        scene.add(this.hexMesh(this._grassGeo, this.textures.grass));
        scene.add(this.hexMesh(this._dirt2Geo, this.textures.dirt2));
        scene.add(this.hexMesh(this._dirtGeo, this.textures.dirt));
        scene.add(this.hexMesh(this._sandGeo, this.textures.sand));
    }
}

export default Land;