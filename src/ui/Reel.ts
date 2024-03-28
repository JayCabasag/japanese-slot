import { Container, Graphics } from "pixi.js";
import { Symbol } from "./Symbol";
import gsap from "gsap";
import { random10Symbols } from "../utils/random";

export class Reel extends Container {
    private masking: Graphics;
    private container: Container;
    private symbols: Symbol[];
    private symbolsInTypes: number[] = []

    constructor(){
        super();
        this.masking = new Graphics()
        .drawRect(0, 0, 250, 500)
        .beginFill(0xff0000)
        this.addChild(this.masking)

        this.container = new Container();
        this.addChild(this.container)

        this.symbolsInTypes = random10Symbols();
        this.symbols = [];
        this.symbolsInTypes.forEach((symbolInType, index) => {
            this.symbols[index] = new Symbol(symbolInType);
            this.symbols[index].scale.set(0.5)
            this.symbols[index].y = index * 150
            this.container.addChild(this.symbols[index])
        })
    }

    /** Show the component */
    public async show(animated = true) {
        gsap.killTweensOf(this.container.scale);
        this.visible = true;
        if (animated) {
            this.container.scale.set(0);
            await gsap.to(this.container.scale, { x: 1, y: 1, duration: 0.3, ease: 'back.out' });
        } else {
            this.container.scale.set(1);
        }
    }

    /** Hide the component */
    public async hide(animated = true) {
        gsap.killTweensOf(this.container.scale);
        if (animated) {
            await gsap.to(this.container.scale, { x: 0, y: 0, duration: 0.3, ease: 'back.in' });
        } else {
            this.container.scale.set(0);
        }
        this.visible = false;
    }
}