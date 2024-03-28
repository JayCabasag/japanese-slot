import { Container } from "pixi.js";
import { SlotConfig, slotGetConfig } from "./SlotConfig";
import { SlotBoard } from "./SlotBoard";

export class Slot extends Container {
    private config: SlotConfig;
    private board: SlotBoard
    
    // Fires when spin start
    public onSpinStart?: () => void;
    // Fires when spin end
    public onSpinEnd?: () => void;
    // Fires when win line
    public onWin?: () => void;
    
    constructor(){
        super()
        
        // Game Sub-systems
        this.config = slotGetConfig();
        this.board = new SlotBoard(this)
    }
}