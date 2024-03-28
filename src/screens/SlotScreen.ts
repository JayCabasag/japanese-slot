import { Container, NineSlicePlane, Texture } from 'pixi.js';
import { navigation } from '../utils/navigation';
import gsap from 'gsap';
import { i18n } from '../utils/i18n';
import { LargeButton } from '../ui/LargeButton';
import { registerCustomEase } from '../utils/animation';
import { waitFor } from '../utils/asyncUtils';
import { RippleButton } from '../ui/RippleButton';
import { SettingsPopup } from '../popups/SettingsPopup';
import { bgm } from '../utils/audio';
import { SlotFrame } from '../ui/SlotFrame';
import { Reel } from '../ui/Reel';

/** Custom ease curve for y animation of the base to reveal the screen */
const easeSoftBackOut = registerCustomEase(
    'M0,0,C0,0,0.05,0.228,0.09,0.373,0.12,0.484,0.139,0.547,0.18,0.654,0.211,0.737,0.235,0.785,0.275,0.864,0.291,0.896,0.303,0.915,0.325,0.944,0.344,0.97,0.356,0.989,0.38,1.009,0.413,1.039,0.428,1.073,0.604,1.074,0.72,1.074,0.822,1.035,0.91,1.011,0.943,1.002,1,1,1,1',
);

/** The first screen that shows up after loading */
export class SlotScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['slot'];
    /** Button that leads to gameplay */
    private startSpinButton: LargeButton;
    /** Button that opens the info panel */
    private settingsButton: RippleButton;
    /** The footer base, also used for transition in */
    private base: NineSlicePlane;
    /** Slot Frame */
    private slotFrame: SlotFrame;
    /** Reels Container */
    private reelsContainer: Container;
    /** Slot Reels */
    private reels: Reel[];

    constructor() {
        super();
        this.base = new NineSlicePlane(Texture.from('rounded-rectangle'), 32, 32, 32, 32);
        this.base.tint = 0x2c136c;
        this.addChild(this.base);

        this.slotFrame = new SlotFrame();
        this.addChild(this.slotFrame)

        this.reelsContainer = new Container();
        this.slotFrame.addChild(this.reelsContainer)

        this.reels = Array.from({ length: 5 }, () => {
            const newReel = new Reel();
            this.reelsContainer.addChild(newReel)
            return newReel;
        });

        this.settingsButton = new RippleButton({
            image: 'icon-settings',
            ripple: 'icon-settings-stroke',
        });
        this.settingsButton.onPress.connect(() => navigation.presentPopup(SettingsPopup));
        this.addChild(this.settingsButton);

        this.startSpinButton = new LargeButton({ text: i18n.startSpinButton });
        this.startSpinButton.onPress.connect(() => {
            console.log("Start Spin now")
        });
        this.addChild(this.startSpinButton);
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.slotFrame.x = width * 0.5
        this.slotFrame.y = (height * 0.5) - 85
        this.startSpinButton.x = width * 0.5;
        this.startSpinButton.y = height - 130;
        this.base.width = width;
        this.base.y = height - 140;
        this.settingsButton.x = width - 30;
        this.settingsButton.y = 30;

        this.reelsContainer.x = -this.slotFrame.x / 2;
        this.reelsContainer.y = -this.slotFrame.y / 2;
        this.reels.forEach((reel, index) => {
            reel.x = index * 195
        })
    }

    /** Show screen with animations */
    public async show() {
        bgm.play('common/bgm-main.mp3', { volume: 0.7 });

        // Reset visual state, hide things that will show up later
        this.slotFrame.hide(false);
        this.startSpinButton.hide(false);
        this.settingsButton.hide(false);
        this.reels.forEach(reel => reel.hide(false))

        // Play reveal animation
        this.playRevealAnimation();

        // Show remaining components in sequence
        await waitFor(0.5);
        await this.startSpinButton.show();
        this.interactiveChildren = true;
        await this.slotFrame.show();
        await this.reels.forEach(async reel => await reel.show())
        await this.settingsButton.show();
    }

    /** Hide screen with animations */
    public async hide() {
        this.startSpinButton.hide();
        await waitFor(0.1);
        gsap.to(this.base.pivot, { y: -200, duration: 0.3, ease: 'back.in' });
    }

    /** Animation for revealing the screen behind the purple sprite */
    private async playRevealAnimation() {
        const duration = 1;
        const ease = easeSoftBackOut;

        gsap.killTweensOf(this.base);
        gsap.killTweensOf(this.base.pivot);

        // Make the flat colour base cover the entire screen, matching the visual state
        // left from loading screen
        this.base.height = navigation.height * 1.25;
        this.base.pivot.y = navigation.height;

        // Animate it to uncover the screen and rest at the bottom
        gsap.to(this.base, {
            height: 200,
            duration,
            ease,
        });
        await gsap.to(this.base.pivot, {
            y: 0,
            duration,
            ease,
        });
    }
}
