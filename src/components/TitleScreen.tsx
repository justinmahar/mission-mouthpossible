import React from "react";
import { useNavigate } from "react-router-dom";
import { audioManager } from "../utils/audioManager";
import { ASSETS } from "../constants/game";
import "./TitleScreen.css";

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    audioManager.playMusic(ASSETS.MUSIC.TITLE);
    navigate("/intro");
  };

  return (
    <div className="title-screen">
      <div className="title-content">
        <img src={ASSETS.LIPS} alt="Lips" className="title-lips" />
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
