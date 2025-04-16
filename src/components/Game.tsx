import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import { GAME_CONFIG, UI_CONFIG, ASSETS, MESSAGES } from "../constants/game";
import { getCompletionMessage } from "../constants/levelMessages";
import { audioManager } from "../utils/audioManager";
import "./Game.css";

/**
 * Main game scene that handles the core gameplay mechanics
 */
class MainScene extends Phaser.Scene {
  // Game objects
  private lips!: Phaser.Physics.Arcade.Sprite;
  private teeth!: Phaser.Physics.Arcade.Group;
  private portal!: Phaser.Physics.Arcade.Sprite;
  private levelObjects: any[] = [];

  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private exitButton!: Phaser.GameObjects.Text;
  private exitConfirm!: Phaser.GameObjects.Container;
  private levelCompleteText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;

  // Game state
  private score: number = 0;
  private level: number = 1;
  private totalTeeth: number = 0;
  private navigate!: (path: string) => void;
  private isLevelComplete: boolean = false;
  private isGameWon: boolean = false;
  private winningMouth!: Phaser.GameObjects.Sprite;
  private winText!: Phaser.GameObjects.Text;
  private winMessage!: Phaser.GameObjects.Text;
  private teethRequired: number = 0;

  constructor() {
    super({ key: "MainScene" });
  }

  /**
   * Initialize the scene with navigation function
   */
  init(data: { navigate: (path: string) => void }): void {
    this.navigate = data.navigate;
  }

  /**
   * Preload game assets
   */
  preload(): void {
    this.load.image("lips", ASSETS.LIPS);
    this.load.image("tooth", ASSETS.TOOTH);
    this.load.image("portal", ASSETS.PORTAL);
    this.load.image("winning-mouth", ASSETS.WINNING_MOUTH);

    // Load all bite sound effects
    ASSETS.SOUNDS.BITES.forEach((bite, index) => {
      this.load.audio(`bite${index + 1}`, bite);
    });

    // Load all completion sound effects
    ASSETS.SOUNDS.COMPLETE.forEach((complete, index) => {
      this.load.audio(`complete${index + 1}`, complete);
    });

    // Load portal sound
    this.load.audio("portal", ASSETS.SOUNDS.PORTAL);
  }

  /**
   * Create the initial game state
   */
  create(): void {
    this.setupGame();
  }

  /**
   * Set up the game state and UI
   */
  private setupGame(): void {
    this.cleanupPreviousGame();
    this.setTeethRequired();
    this.createLips();
    this.createTeeth();
    this.createPortal();
    this.setupCollisions();
    this.createUI();
    this.createLevelCompleteUI();
    this.isLevelComplete = false;
  }

  /**
   * Clean up all game objects before starting a new level
   */
  private cleanupPreviousGame(): void {
    // Clean up level objects
    this.levelObjects.forEach((obj) => {
      if (obj instanceof Phaser.Physics.Arcade.Group) {
        obj.clear(true, true);
      } else {
        obj.destroy();
      }
    });
    this.levelObjects = [];

    // Clean up UI elements
    if (this.exitButton) this.exitButton.destroy();
    if (this.exitConfirm) this.exitConfirm.destroy();
    if (this.levelCompleteText) this.levelCompleteText.destroy();

    this.score = 0;
  }

  /**
   * Add a game object to the level objects group
   */
  private addToLevelObjects(obj: any): void {
    this.levelObjects.push(obj);
  }

  /**
   * Create and configure the lips sprite
   */
  private createLips(): void {
    this.lips = this.physics.add.sprite(
      GAME_CONFIG.LIPS_START_POSITION.x,
      GAME_CONFIG.LIPS_START_POSITION.y,
      "lips"
    );
    this.lips.setCollideWorldBounds(true);
    this.addToLevelObjects(this.lips);
  }

  /**
   * Create the portal sprite
   */
  private createPortal(): void {
    this.portal = this.physics.add.sprite(
      GAME_CONFIG.PORTAL_POSITION.x,
      GAME_CONFIG.PORTAL_POSITION.y,
      "portal"
    );
    this.portal.setVisible(false);
    this.portal.setTint(0x00ffff);

    // Set up a circular/elliptical collision body
    if (this.portal.body) {
      const portalWidth = 60; // Adjust based on the visible portal size
      const portalHeight = 40; // Slightly smaller for the perspective effect
      this.portal.body.setSize(portalWidth, portalHeight);
      this.portal.body.setOffset(
        (this.portal.width - portalWidth) / 2,
        (this.portal.height - portalHeight) / 2
      );
    }

    this.addToLevelObjects(this.portal);

    // Add pulsing animation
    this.tweens.add({
      targets: this.portal,
      scale: { from: 0.8, to: 1.2 },
      alpha: { from: 0.8, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /**
   * Set the number of teeth required for the current level
   */
  private setTeethRequired(): void {
    this.teethRequired = Phaser.Math.Between(
      GAME_CONFIG.MIN_TEETH_PER_LEVEL,
      GAME_CONFIG.MAX_TEETH_PER_LEVEL
    );
  }

  /**
   * Create the teeth group with random positions
   */
  private createTeeth(): void {
    this.teeth = this.physics.add.group();
    this.addToLevelObjects(this.teeth);

    const TEXT_REGION = {
      x: 0,
      y: 0,
      width: 200, // Safe width for text area
      height: 100, // Safe height for text area
    };

    for (let i = 0; i < this.teethRequired; i++) {
      let x, y;
      do {
        x = Phaser.Math.Between(50, GAME_CONFIG.WIDTH - 50);
        y = Phaser.Math.Between(50, GAME_CONFIG.HEIGHT - 50);
      } while (x < TEXT_REGION.width && y < TEXT_REGION.height);

      this.teeth.create(x, y, "tooth");
    }
  }

  /**
   * Set up collision detection between lips and teeth/portal
   */
  private setupCollisions(): void {
    this.physics.add.overlap(
      this.lips,
      this.teeth,
      ((object1: any, object2: any) => {
        const toothSprite = object2 as Phaser.GameObjects.Sprite;
        toothSprite.destroy();
        this.score++;
        this.totalTeeth++;
        this.updateScoreText();

        // Play a random bite sound
        const randomBiteNumber = Phaser.Math.Between(
          1,
          ASSETS.SOUNDS.BITES.length
        );
        this.sound.play(`bite${randomBiteNumber}`);

        if (this.totalTeeth >= GAME_CONFIG.TOTAL_TEETH_TO_WIN) {
          this.winGame();
        } else if (this.score === this.teethRequired) {
          this.completeLevel();
        }
      }) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Add debug visualization for development
    // this.physics.world.createDebugGraphic();
    // this.portal.body.debugShowBody = true;
    // this.portal.body.debugShowVelocity = true;

    this.physics.add.overlap(
      this.lips,
      this.portal,
      ((object1: any, object2: any) => {
        if (this.isLevelComplete) {
          // Play portal sound at 80% volume
          this.sound.play("portal", { volume: 0.8 });
          this.startNextLevel();
        }
      }) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  /**
   * Create all UI elements
   */
  private createUI(): void {
    this.createScoreText();
    this.createLevelText();
    this.createExitButton();
    this.createExitConfirm();
  }

  /**
   * Create the score display text
   */
  private createScoreText(): void {
    this.scoreText = this.add.text(
      16,
      16,
      `Level Teeth: ${this.score}/${this.teethRequired}\nTotal Teeth: ${this.totalTeeth}/${GAME_CONFIG.TOTAL_TEETH_TO_WIN}\nLevel: ${this.level}`,
      {
        ...UI_CONFIG.TEXT,
        lineSpacing: 4,
      }
    );
    this.addToLevelObjects(this.scoreText);
  }

  /**
   * Create the level display text
   */
  private createLevelText(): void {
    // This method is now empty as we've moved the level display into the score text
  }

  /**
   * Create the exit button
   */
  private createExitButton(): void {
    this.exitButton = this.add.text(
      GAME_CONFIG.WIDTH - 100,
      16,
      MESSAGES.EXIT,
      UI_CONFIG.TEXT
    );
    this.exitButton.setInteractive();
    this.exitButton.on("pointerdown", this.showExitConfirm, this);
  }

  /**
   * Create the exit confirmation dialog
   */
  private createExitConfirm(): void {
    this.exitConfirm = this.add.container(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2
    );

    const background = this.add.rectangle(
      0,
      0,
      UI_CONFIG.EXIT_DIALOG.width,
      UI_CONFIG.EXIT_DIALOG.height,
      UI_CONFIG.EXIT_DIALOG.backgroundColor,
      UI_CONFIG.EXIT_DIALOG.backgroundAlpha
    );
    const text = this.add
      .text(0, -50, MESSAGES.EXIT_CONFIRM, {
        fontSize: UI_CONFIG.EXIT_DIALOG.fontSize,
        color: UI_CONFIG.EXIT_DIALOG.textColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const yesButton = this.add
      .text(-50, 50, MESSAGES.YES, {
        fontSize: UI_CONFIG.EXIT_DIALOG.fontSize,
        color: UI_CONFIG.EXIT_DIALOG.textColor,
      })
      .setOrigin(0.5);
    const noButton = this.add
      .text(50, 50, MESSAGES.NO, {
        fontSize: UI_CONFIG.EXIT_DIALOG.fontSize,
        color: UI_CONFIG.EXIT_DIALOG.textColor,
      })
      .setOrigin(0.5);

    yesButton.setInteractive();
    noButton.setInteractive();

    yesButton.on("pointerdown", () => this.navigate("/"));
    noButton.on("pointerdown", () => this.hideExitConfirm());

    this.exitConfirm.add([background, text, yesButton, noButton]);
    this.exitConfirm.setVisible(false);
  }

  /**
   * Create the level completion UI
   */
  private createLevelCompleteUI(): void {
    // Create level complete text
    this.levelCompleteText = this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT / 2 - 50,
        MESSAGES.LEVEL_COMPLETE,
        UI_CONFIG.LEVEL_COMPLETE
      )
      .setOrigin(0.5)
      .setVisible(false);
    this.addToLevelObjects(this.levelCompleteText);

    // Create completion message
    const completionMessage = this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT / 2 + 80,
        "",
        UI_CONFIG.COMPLETION_MESSAGE
      )
      .setOrigin(0.5)
      .setVisible(false)
      .setAlpha(0); // Start invisible for fade in

    // Add a reveal animation when the message becomes visible
    this.tweens
      .add({
        targets: completionMessage,
        alpha: { from: 0, to: 1 },
        y: {
          from: GAME_CONFIG.HEIGHT / 2 + 100,
          to: GAME_CONFIG.HEIGHT / 2 + 80,
        },
        duration: 800,
        ease: "Power2",
        onComplete: () => {
          // Add a gentle floating animation
          this.tweens.add({
            targets: completionMessage,
            y: "+=5",
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
          });
        },
      })
      .pause(); // Pause initially, will play when message becomes visible

    // Store the tween reference on the message object for later use
    completionMessage.setData("revealTween", this.tweens.getTweens().pop());

    this.addToLevelObjects(completionMessage);
  }

  /**
   * Start the next level
   */
  private startNextLevel(): void {
    this.level++;
    this.levelCompleteText.setVisible(false);
    this.setupGame();
  }

  /**
   * Update game state each frame
   */
  update(): void {
    if (!this.isGameWon) {
      this.handleLipsMovement();
    }
  }

  /**
   * Handle lips movement based on keyboard input
   */
  private handleLipsMovement(): void {
    const cursors = this.input?.keyboard?.createCursorKeys();
    if (!cursors) return;

    // Calculate current movement speed based on total teeth
    const currentSpeed =
      GAME_CONFIG.BASE_MOVEMENT_SPEED +
      this.totalTeeth * GAME_CONFIG.SPEED_INCREMENT_PER_TOOTH;

    // Handle horizontal movement (left/right or A/D)
    if (cursors.left.isDown || this.input?.keyboard?.addKey("A").isDown) {
      this.lips.setVelocityX(-currentSpeed);
    } else if (
      cursors.right.isDown ||
      this.input?.keyboard?.addKey("D").isDown
    ) {
      this.lips.setVelocityX(currentSpeed);
    } else {
      this.lips.setVelocityX(0);
    }

    // Handle vertical movement (up/down or W/S)
    if (cursors.up.isDown || this.input?.keyboard?.addKey("W").isDown) {
      this.lips.setVelocityY(-currentSpeed);
    } else if (
      cursors.down.isDown ||
      this.input?.keyboard?.addKey("S").isDown
    ) {
      this.lips.setVelocityY(currentSpeed);
    } else {
      this.lips.setVelocityY(0);
    }
  }

  /**
   * Update the score display
   */
  private updateScoreText(): void {
    this.scoreText.setText(
      `Level Teeth: ${this.score}/${this.teethRequired}\nTotal Teeth: ${this.totalTeeth}/${GAME_CONFIG.TOTAL_TEETH_TO_WIN}\nLevel: ${this.level}`
    );
  }

  /**
   * Handle level completion
   */
  private completeLevel(): void {
    this.lips.setVelocity(0);
    this.levelCompleteText.setVisible(true);

    // Play a random completion sound
    const randomCompleteNumber = Phaser.Math.Between(
      1,
      ASSETS.SOUNDS.COMPLETE.length
    );
    this.sound.play(`complete${randomCompleteNumber}`, { volume: 0.4 });

    // Show completion message with animation
    const message = getCompletionMessage(this.level);
    const completionMessage = this.levelObjects.find(
      (obj) => obj instanceof Phaser.GameObjects.Text && !obj.visible
    ) as Phaser.GameObjects.Text;

    if (completionMessage) {
      completionMessage.setText(message);
      completionMessage.setVisible(true);
      // Play the reveal animation
      const revealTween = completionMessage.getData("revealTween");
      if (revealTween) {
        revealTween.restart();
      }
    }

    // Position the portal randomly, ensuring it's not too close to the edges or the lips
    let x: number, y: number;
    const MIN_DISTANCE_FROM_LIPS = 300; // Minimum distance from lips
    let attempts = 0;
    const MAX_ATTEMPTS = 20;
    const BOTTOM_AREA_HEIGHT = 150; // Height of the bottom area where the portal can spawn

    // Get the current lips position
    const lipsX = this.lips.x;
    const lipsY = this.lips.y;

    // Define safe zones (areas where the portal can spawn)
    const safeZones = [
      {
        x: {
          min: GAME_CONFIG.PORTAL_MIN_DISTANCE,
          max: lipsX - MIN_DISTANCE_FROM_LIPS,
        },
        y: {
          min: GAME_CONFIG.HEIGHT - BOTTOM_AREA_HEIGHT,
          max: GAME_CONFIG.HEIGHT - GAME_CONFIG.PORTAL_MIN_DISTANCE,
        },
      },
      {
        x: {
          min: lipsX + MIN_DISTANCE_FROM_LIPS,
          max: GAME_CONFIG.WIDTH - GAME_CONFIG.PORTAL_MIN_DISTANCE,
        },
        y: {
          min: GAME_CONFIG.HEIGHT - BOTTOM_AREA_HEIGHT,
          max: GAME_CONFIG.HEIGHT - GAME_CONFIG.PORTAL_MIN_DISTANCE,
        },
      },
    ];

    do {
      // Choose a random safe zone
      const zone = safeZones[Phaser.Math.Between(0, safeZones.length - 1)];
      x = Phaser.Math.Between(zone.x.min, zone.x.max);
      y = Phaser.Math.Between(zone.y.min, zone.y.max);
      attempts++;
    } while (
      Phaser.Math.Distance.Between(x, y, lipsX, lipsY) <
        MIN_DISTANCE_FROM_LIPS &&
      attempts < MAX_ATTEMPTS
    );

    // Ensure the portal stays within screen bounds
    x = Phaser.Math.Clamp(
      x,
      GAME_CONFIG.PORTAL_MIN_DISTANCE,
      GAME_CONFIG.WIDTH - GAME_CONFIG.PORTAL_MIN_DISTANCE
    );
    y = Phaser.Math.Clamp(
      y,
      GAME_CONFIG.HEIGHT - BOTTOM_AREA_HEIGHT,
      GAME_CONFIG.HEIGHT - GAME_CONFIG.PORTAL_MIN_DISTANCE
    );

    this.portal.setPosition(x, y);
    this.portal.setVisible(true);
    this.portal.setScale(1); // Reset scale when making visible
    this.portal.setAlpha(1); // Reset alpha when making visible
    this.portal.setTint(0x00ffff); // Ensure bright cyan tint is applied

    this.isLevelComplete = true;
  }

  /**
   * Show the exit confirmation dialog
   */
  private showExitConfirm(): void {
    if (this.exitConfirm) {
      this.exitConfirm.setVisible(true);
    }
  }

  /**
   * Hide the exit confirmation dialog
   */
  private hideExitConfirm(): void {
    if (this.exitConfirm) {
      this.exitConfirm.setVisible(false);
    }
  }

  /**
   * Handle game win condition
   */
  private winGame(): void {
    this.isGameWon = true;
    this.lips.setVelocity(0);
    this.cleanupPreviousGame();

    // Store win state
    localStorage.setItem("gameWon", "true");

    // Play winning music
    audioManager.playMusic(ASSETS.MUSIC.WIN);

    this.showWinScreen();
  }

  /**
   * Show the winning screen
   */
  private showWinScreen(): void {
    // Create win text at the top
    this.winText = this.add
      .text(GAME_CONFIG.WIDTH / 2, 80, MESSAGES.CONGRATULATIONS, {
        ...UI_CONFIG.WIN_SCREEN.textStyle,
        wordWrap: { width: GAME_CONFIG.WIDTH - 100 },
      })
      .setOrigin(0.5);

    // Create winning mouth
    this.winningMouth = this.add.sprite(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 150,
      "winning-mouth"
    );
    this.winningMouth.setScale(UI_CONFIG.WIN_SCREEN.mouthScale);

    // Create win message
    this.winMessage = this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT / 2,
        MESSAGES.WIN_MESSAGE,
        {
          ...UI_CONFIG.WIN_SCREEN.messageStyle,
          wordWrap: { width: GAME_CONFIG.WIDTH - 100 },
          lineSpacing: 15,
        }
      )
      .setOrigin(0.5);

    // Create return to title button
    const returnButton = this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT - 80,
        "Return to Title",
        UI_CONFIG.WIN_SCREEN.returnButton
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Add hover effect
    returnButton.on("pointerover", () => {
      returnButton.setScale(1.1);
    });

    returnButton.on("pointerout", () => {
      returnButton.setScale(1);
    });

    // Add click handler
    returnButton.on("pointerdown", () => {
      this.navigate("/");
    });

    // Add to level objects for cleanup
    this.addToLevelObjects(this.winningMouth);
    this.addToLevelObjects(this.winText);
    this.addToLevelObjects(this.winMessage);
    this.addToLevelObjects(returnButton);
  }

  /**
   * Clean up resources when scene is stopped or destroyed
   */
  preDestroy(): void {
    audioManager.stopMusic();
  }
}

/**
 * React component that initializes and manages the Phaser game
 */
const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      parent: gameRef.current,
      backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: MainScene,
    };

    const game = new Phaser.Game(config);
    game.scene.start("MainScene", { navigate });

    return () => {
      game.destroy(true);
    };
  }, [navigate]);

  return <div ref={gameRef} className="game-container" />;
};

export default Game;
