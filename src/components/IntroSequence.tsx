import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroSequence.css";

const plotScreens = [
  {
    id: 1,
    text: "In a world saturated with saccharine smiles... one mouth felt... empty. Not just emotionally, but like, literally. Gums like vacant lots.",
  },
  {
    id: 2,
    text: "This mouth, known only as 'The Maw', dreamt of a grin so sharp, so complete, it could cut glass... or at least aggressively chew gum.",
  },
  {
    id: 3,
    text: "Suddenly, whispers on the slobbery breeze... Runaway teeth! Escaped from the tyrannical rule of the Flossophy Institute! These rogue chompers were hiding, yearning for a purpose... a purpose The Maw could provide.",
  },
  {
    id: 4,
    text: "Your mission: Help The Maw achieve MAXIMUM TOOTHINESS. Hunt down those pearly escapees. Build the most gloriously overpopulated smile imaginable!",
  },
];

const IntroSequence: React.FC = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentScreenIndex < plotScreens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else {
      navigate("/game");
    }
  };

  const currentScreen = plotScreens[currentScreenIndex];

  return (
    <div className="intro-sequence">
      <div className="intro-content">
        <p className="intro-text">{currentScreen.text}</p>
        <button className="intro-button" onClick={handleNext}>
          {currentScreenIndex < plotScreens.length - 1
            ? "Continue..."
            : "Let's Get Chewing!"}
        </button>
      </div>
    </div>
  );
};

export default IntroSequence;
