import { BoxGeometry } from 'https://cdn.skypack.dev/three@0.137';

class River{
    river: BoxGeometry;

    constructor(height:number, position:any) {
        // Direction
        this.river = new BoxGeometry(0.5, height, 1);
        this.river.translate(position.x, height/2 + 0.1, position.y);
        // if (Math.random() > 0.5)
        //     this.river.rotateX(180);
    }

    deploy() {
        return this.river;
    }
}

export default River;