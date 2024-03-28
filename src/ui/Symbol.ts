import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";

export class Symbol extends Container {
    private assetsList = [
        "slot/letter_a.json",
        "slot/letter_j.json",
        "slot/letter_k.json",
        "slot/letter_q.json",
        "slot/rice_balls.json",
        "slot/sushi_1.json",
        "slot/sushi_2.json",
        "slot/sushi_3.json",
        "slot/umbrella.json",
        "slot/wild.json"
    ]
    private symbol: Spine;

    constructor(asset = 1){
        super()
        const skeleton = Assets.cache.get(`${this.assetsList[asset - 1]}`)
        console.log(skeleton)
        this.symbol = new Spine(skeleton.spineData)
        this.addChild(this.symbol)
    }
}