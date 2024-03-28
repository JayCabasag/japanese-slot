import { Container } from "pixi.js";
import { Slot } from "./Slot";

export class SlotBoard extends Container {
    private slot: Slot;
    constructor(slot: Slot){
        super();
        this.slot = slot;
    }
}