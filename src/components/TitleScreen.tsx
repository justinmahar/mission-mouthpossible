import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { audioManager } from "../utils/audioManager";
import { ASSETS } from "../constants/game";
import "./TitleScreen.css";

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [hasWon, setHasWon] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if the game has been won before
    const gameWon = localStorage.getItem("gameWon") === "true";
    setHasWon(gameWon);

    // Initialize click sound
    clickSoundRef.current = new Audio(ASSETS.SOUNDS.CLICK);
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.8;
    }
  }, []);

  const handleStart = () => {
    // Play click sound
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }

    audioManager.playMusic(ASSETS.MUSIC.TITLE);
    navigate("/intro");
  };

  return (
    <div className="title-screen">
      <div className="title-content">
        <img
          src={hasWon ? ASSETS.WINNING_MOUTH : ASSETS.LIPS}
          alt={hasWon ? "Winning Mouth" : "Lips"}
          className="title-lips"
        />
        <h1 className="game-title">Mission MouthPossible</h1>
        <p className="game-subtitle">Grab life by the tooth.</p>
        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default TitleScreen;
