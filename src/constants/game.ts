/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  MIN_TEETH_PER_LEVEL: 2,
  MAX_TEETH_PER_LEVEL: 4,
  TOTAL_TEETH_TO_WIN: 32,
  LIPS_START_POSITION: { x: 400, y: 300 },
  MOVEMENT_SPEED: 200,
  BACKGROUND_COLOR: "#8B0000",
  HOLE_POSITION: { x: 700, y: 500 },
  HOLE_MIN_DISTANCE: 100,
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  TEXT: {
    fontSize: "32px",
    color: "#fff",
  },
  LEVEL_COMPLETE: {
    fontSize: "48px",
    color: "#fff",
  },
  BUTTON: {
    fontSize: "32px",
    color: "#fff",
    backgroundColor: "#4CAF50",
    padding: { x: 20, y: 10 },
  },
  EXIT_DIALOG: {
    width: 300,
    height: 200,
    backgroundColor: 0xffffff,
    backgroundAlpha: 0.8,
    textColor: "#000",
    fontSize: "32px",
  },
  WIN_SCREEN: {
    mouthScale: 0.8,
    textStyle: {
      fontSize: "42px",
      color: "#fff",
      fontStyle: "bold",
    },
    messageStyle: {
      fontSize: "24px",
      color: "#fff",
      align: "center",
      lineSpacing: 10,
    },
    returnButton: {
      fontSize: "24px",
      color: "#000",
      backgroundColor: "#4CAF50",
      padding: { x: 20, y: 10 },
    },
  },
} as const;

/**
 * Asset paths
 */
export const ASSETS = {
  LIPS: "/assets/lips.svg",
  TOOTH: "/assets/tooth.svg",
  HOLE: "/assets/hole.svg",
  WINNING_MOUTH: "/assets/winning-mouth.svg",
  MUSIC: {
    TITLE: "/assets/Epicurean%20Stomp.mp3",
    GAME: "/assets/Heavy%20Wallet.mp3",
    WIN: "/assets/Taste%20The%20Sax.mp3",
  },
} as const;

/**
 * Game messages
 */
export const MESSAGES = {
  LEVEL_COMPLETE: "Level complete!",
  EXIT_CONFIRM: "Exit Game?",
  CONGRATULATIONS: "MISSION ACCOMPLISHED!",
  WIN_MESSAGE:
    "The Maw is unstoppable!\nWith these contraband chompers, you've become\ndental history's most fearsome set of teeth.\n\nThe Flossophy Institute trembles...\nLong live The Maw!",
  YES: "Yes",
  NO: "No",
  EXIT: "Exit",
} as const;
