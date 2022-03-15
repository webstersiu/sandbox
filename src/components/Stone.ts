import { SphereGeometry } from 'https://cdn.skypack.dev/three@0.137';

class Stone{
    stone: SphereGeometry;

    constructor(height:number, position:any) {
        const px = Math.random() * 0.2;
        const pz = Math.random() * 0.2;
        
        this.stone = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
        this.stone.translate(position.x + px, height, position.y + pz);
    }

    deploy() {
        return this.stone;
    }
}

export default Stone;