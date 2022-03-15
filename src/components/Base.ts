import { TextureLoader } from 'https://cdn.skypack.dev/three@0.137';

class Base{
    readonly MAX_HEIGHT: number = 10;
    readonly MAX_WIDTH: number = 100;
    textures: any;

    constructor() {
        const imgFolder = "../../assets/";

        this.textures = {
            dirt: new TextureLoader().load(imgFolder + "dirt.png"),
            dirt2: new TextureLoader().load(imgFolder + "dirt2.jpg"),
            grass: new TextureLoader().load(imgFolder + "grass.jpg"),
            sand: new TextureLoader().load(imgFolder + "sand.jpg"),
            water: new TextureLoader().load(imgFolder + "water.jpg"),
            stone: new TextureLoader().load(imgFolder + "stone.png"),
        };
    }
}

export default Base;