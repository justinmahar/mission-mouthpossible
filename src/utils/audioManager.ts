class AudioManager {
  private static instance: AudioManager;
  private currentMusic: HTMLAudioElement | null = null;
  private currentMusicSrc: string | null = null;
  private isReady: boolean = false;
  private readonly VOLUME: number = 0.5; // 50% volume

  private constructor() {
    // Setup interaction listener
    const setupAudio = () => {
      this.isReady = true;
      // If we had music queued up, play it now
      if (this.currentMusicSrc) {
        this.playMusic(this.currentMusicSrc);
      }
      // Remove the listener once we're ready
      document.removeEventListener("click", setupAudio);
      document.removeEventListener("keydown", setupAudio);
    };

    // Add listeners for user interaction
    document.addEventListener("click", setupAudio);
    document.addEventListener("keydown", setupAudio);
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public playMusic(src: string): void {
    // Store the requested music source
    this.currentMusicSrc = src;

    // If we're not ready for audio yet, wait for user interaction
    if (!this.isReady) {
      return;
    }

    // Stop current music if playing
    this.stopMusic();

    try {
      // Start new music
      this.currentMusic = new Audio(src);
      this.currentMusic.loop = true;
      this.currentMusic.volume = this.VOLUME;

      // Play and catch any errors
      const playPromise = this.currentMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio playback failed:", error);
        });
      }
    } catch (error) {
      console.log("Audio creation failed:", error);
    }
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
    this.currentMusicSrc = null;
  }
}

export const audioManager = AudioManager.getInstance();
