import { TextureLoader} from 'https://cdn.skypack.dev/three@0.137';

class Base{
    constructor() {
        this.MAX_HEIGHT = 10;
        
        this.textures = {
            dirt: new TextureLoader().load("../../assets/dirt_hd.jpg"),
            dirt2: new TextureLoader().load("../../assets/dirt2_hd.jpg"),
            grass: new TextureLoader().load("../../assets/grass_hd.jpg"),
            sand: new TextureLoader().load("../../assets/sand_hd.jpg"),
            water: new TextureLoader().load("../../assets/water_hd.jpg"),
            stone: new TextureLoader().load("../../assets/stone_hd.jpg"),
            snow: new TextureLoader().load("../../assets/snow_hd.png"),
            wood: new TextureLoader().load("../../assets/wood.jpg"),
        };
    }
}

export default Base;