import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TitleScreen from "./components/TitleScreen";
import IntroSequence from "./components/IntroSequence";
import Game from "./components/Game";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/intro" element={<IntroSequence />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
