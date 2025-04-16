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
  BASE_MOVEMENT_SPEED: 200,
  SPEED_INCREMENT_PER_TOOTH: 5,
  BACKGROUND_COLOR: "#8B0000",
  PORTAL_POSITION: { x: 700, y: 500 },
  PORTAL_MIN_DISTANCE: 100,
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  TEXT: {
    fontSize: "20px",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    padding: { x: 8, y: 4 },
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: "#000",
      blur: 4,
      stroke: true,
      fill: true,
    },
  },
  LEVEL_COMPLETE: {
    fontSize: "64px",
    color: "#fff",
    fontFamily: "'Arial Black', sans-serif",
    fontStyle: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: { x: 40, y: 20 },
    borderRadius: 15,
    shadow: {
      offsetX: 3,
      offsetY: 3,
      color: "#000",
      blur: 8,
      fill: true,
      stroke: true,
    },
    stroke: "#4CAF50",
    strokeThickness: 2,
  },
  COMPLETION_MESSAGE: {
    fontSize: "24px",
    color: "#fff",
    fontFamily: "'Courier New', monospace",
    fontStyle: "italic",
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    padding: { x: 20, y: 15 },
    borderRadius: 10,
    align: "center",
    wordWrap: { width: 500 },
    lineSpacing: 8,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: "#000",
      blur: 6,
      fill: true,
    },
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
  PORTAL: "/assets/hole.svg",
  WINNING_MOUTH: "/assets/winning-mouth.svg",
  MUSIC: {
    TITLE: "/assets/Epicurean%20Stomp.mp3",
    GAME: "/assets/Heavy%20Wallet.mp3",
    WIN: "/assets/Taste%20The%20Sax.mp3",
  },
  SOUNDS: {
    BITES: [
      "/assets/bite-1.wav",
      "/assets/bite-2.wav",
      "/assets/bite-3.wav",
      "/assets/bite-4.wav",
      "/assets/bite-5.wav",
      "/assets/bite-6.wav",
      "/assets/bite-7.wav",
    ],
    COMPLETE: [
      "/assets/complete-1.mp3",
      "/assets/complete-2.mp3",
      "/assets/complete-3.mp3",
      "/assets/complete-4.mp3",
    ],
    PORTAL: "/assets/portal.wav",
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
