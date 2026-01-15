import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import GameContainer from './components/GameContainer';
import VideoPlayer from './components/VideoPlayer';

const AppContent = () => {
  const { isTransitioning } = useGame();

  return (
    <div className="App">
      {isTransitioning ? <VideoPlayer /> : <GameContainer />}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
