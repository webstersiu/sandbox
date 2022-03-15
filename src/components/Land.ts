import { CylinderGeometry, Group, BoxGeometry, Mesh, MeshPhysicalMaterial, Vector2, BufferGeometry, Color, RepeatWrapping } from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise';
import Base from './Base.js';
import Tree from './Tree.js';
import Stone from './Stone.js';
import Cloud from './Cloud.js';


class Land extends Base {
    group: Group;

    waterGeo: BufferGeometry;

    STONE_HEIGHT: number = this.MAX_HEIGHT * 0.8;
    DIRT_HEIGHT: number = this.MAX_HEIGHT * 0.7;
    GRASS_HEIGHT: number = this.MAX_HEIGHT * 0.5;
    SAND_HEIGHT: number = this.MAX_HEIGHT * 0.3;
    DIRT2_HEIGHT: number = this.MAX_HEIGHT * 0;

    isHex: boolean = false;

    constructor() {
        super();

        this.waterGeo = new BoxGeometry(0,0,0);
        this.group = new Group();

        // this.autoGen();
        this.loadGeo();
    }
    
    blockGeometry(height:number, position:any) {

        if (this.isHex) {
            // hex
            let geo  = new CylinderGeometry(1, 1, height, 6, 1, false);
            geo.translate(position.x, height * 0.5, position.y);
            return geo;
        } else {
            // square
            let geo = new BoxGeometry(1, height, 1);
            geo.translate(position.x, height * 0.5, position.y);
            return geo;
        }
    }

    block(height:number, position:any) {
        let geo = this.blockGeometry(height, position);

        if(height > this.STONE_HEIGHT) {
            if(Math.random() > 0.8) {
                this.group.add(this.blockMesh(mergeBufferGeometries([geo, new Stone(height, position).deploy()]), this.textures.stone));
            }
            this.group.add(this.blockMesh(geo, this.textures.stone));
        } else if(height > this.DIRT_HEIGHT) {
            if(Math.random() > 0.8) {
                this.group.add(this.blockMesh(mergeBufferGeometries([geo, new Tree(height, position).deploy()]), this.textures.grass));
            }
            this.group.add(this.blockMesh(geo, this.textures.dirt));
        } else if(height > this.GRASS_HEIGHT) {
            this.group.add(this.blockMesh(geo, this.textures.grass));
        } else if(height > this.SAND_HEIGHT) { 
            if(Math.random() > 0.8) {
                this.group.add(this.blockMesh(mergeBufferGeometries([geo, new Stone(height, position).deploy()]), this.textures.stone));
            }
            this.group.add(this.blockMesh(geo, this.textures.sand));
        } else if(height > this.DIRT2_HEIGHT) {
            this.group.add(this.blockMesh(geo, this.textures.dirt2));
        }

        this.waterGeo = mergeBufferGeometries([this.waterGeo, this.blockGeometry(2, position)]);
    }
      
    blockMesh(geo:BufferGeometry, map:any) {
        let mat = new MeshPhysicalMaterial({ 
            flatShading: true,
            map
        });
      
        let mesh = new Mesh(geo, mat);
        mesh.castShadow = true; //default is false
        mesh.receiveShadow = true; //default

        return mesh;
    }

    waterMesh(geo:BufferGeometry) {
        let waterTexture = this.textures.water;
        waterTexture.wrapS = RepeatWrapping;
        waterTexture.wrapT = RepeatWrapping;

        let mesh = new Mesh(
            geo, 
            new MeshPhysicalMaterial({
                color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
                ior: 1.4,
                transmission: 1,
                transparent: true,
                roughness: 0.5,
                metalness: 0.025,
                roughnessMap: waterTexture,
                metalnessMap: waterTexture,
            })
        );
        mesh.receiveShadow = true;
        return mesh;
    }

    tileToPosition(tileX:number, tileY:number) {
        if (this.isHex) {
            // hex
            return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
        } else {
            // square
            return new Vector2(tileX + 2, tileY  + 2);
        }
    }

    autoGen() {
        const simplex = new SimplexNoise(); // optional seed as a string parameter
        // Cloud
        let cloud_counter = Math.floor(Math.pow(Math.random(), 0.45) * 4);
        let total_cloud = 0;

        // generate the foundation
        for(let i = -10; i <= 10; i++) {
            for(let j = -10; j <= 10; j++) {
                let position = this.tileToPosition(i, j);
        
                // if(position.length() > 16) continue;
                
                let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
                noise = Math.pow(noise, 1.5);
        
                this.block(noise * this.MAX_HEIGHT, position);

                if (Math.random() > 0.2 && total_cloud < cloud_counter) {
                    this.group.add(new Cloud(this.MAX_HEIGHT, position).deploy());
                    total_cloud++;
                }
            }
        }

        this.group.add(this.waterMesh(this.waterGeo));
    }

    loadGeo() {
        // Cloud
        let cloud_counter = Math.floor(Math.pow(Math.random(), 0.45) * 4);
        let total_cloud = 0;
        let coor = [
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4,4],
            [4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4,4,4],
            [4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,2.5,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,3,4,4,4,4,4],
            [4,4,4,4,4,3,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4],
            [4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4,4],
            [4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,4,4,4,4,4,4,4,4],
            [4,4,4,4,2,2,1,1,0.2,0.2,1,1,2,2,2.5,4,4,4,4,4,4]
        ];

        const MEAN = (coor.length / 2 | 0);
        for(let i = 0; i < coor.length; i++) {
            for(let j = 0; j < coor[i].length; j++) {
                let position = this.tileToPosition(i - MEAN, j - MEAN);
        
                // if(position.length() > 16) continue;
                
                this.block(coor[i][j], position);

                if (Math.random() > 0.2 && total_cloud < cloud_counter) {
                    this.group.add(new Cloud(this.MAX_HEIGHT, position).deploy());
                    total_cloud++;
                }
            }
        }
        this.group.add(this.waterMesh(this.waterGeo));
    }

    deploy() {
        return this.group;
    }
}

export default Land;