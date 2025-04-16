import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "../constants/game";
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
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize click sound
    clickSoundRef.current = new Audio(ASSETS.SOUNDS.CLICK);
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.8;
    }
  }, []);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText("");
    let currentText = "";
    const text = plotScreens[currentScreenIndex].text;
    let currentChar = 0;

    const typingInterval = setInterval(() => {
      if (currentChar < text.length) {
        currentText += text[currentChar];
        setDisplayedText(currentText);
        currentChar++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentScreenIndex]);

  const handleNext = () => {
    // Play click sound
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }

    if (isTyping) {
      // When skipping, immediately go to next screen
      if (currentScreenIndex < plotScreens.length - 1) {
        setCurrentScreenIndex(currentScreenIndex + 1);
      } else {
        navigate("/game");
      }
    } else if (currentScreenIndex < plotScreens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else {
      navigate("/game");
    }
  };

  return (
    <div className="intro-sequence">
      <div className="intro-content">
        <p className="intro-text">{displayedText}</p>
        <button
          className="intro-button"
          onClick={handleNext}
          style={{ opacity: isTyping ? 0.7 : 1 }}
        >
          {isTyping
            ? "Skip >>"
            : currentScreenIndex < plotScreens.length - 1
            ? "Continue..."
            : "Let's Get Chewing!"}
        </button>
      </div>
    </div>
  );
};

export default IntroSequence;
