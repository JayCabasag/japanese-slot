/** List of all valid game modes */
export const slotValidModes = ['norma', 'free-spin'] as const;

/** The game mode type */
export type SlotMode = typeof slotValidModes[number];

/** Default match3 configuration */
const defaultConfig = {
    /** Number of rows in the game */
    rows: 3,
    /** Number of columns in the game */
    columns: 5,
    /** The size (width & height, in pixels) of each cell in the grid */
    tileSize: 15,
    /** Validate all moves, regardless if they create a match or not */
    freeMoves: false,
    /** Gameplay duration, in seconds */
    duration: 60,
    /** Gameplay mode - affects the number of piece types in the grid */
    mode: <SlotMode>'normal',
};

/** Match3 configuration */
export type SlotConfig = typeof defaultConfig;

/** Build a config object overriding default values if suitable */
export function slotGetConfig(customConfig: Partial<SlotConfig> = {}): SlotConfig {
    return { ...defaultConfig, ...customConfig };
}
