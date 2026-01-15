import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import MainScreen from './components/MainScreen';
import GameContainer from './components/GameContainer';
import VideoPlayer from './components/VideoPlayer';
import StartVideo from './components/StartVideo';

const AppContent = () => {
  const { gameStarted, isTransitioning, showStartVideo } = useGame();

  // start 비디오 표시
  if (showStartVideo) {
    return <StartVideo />;
  }

  // 게임 시작 전: 메인 화면 표시
  if (!gameStarted) {
    return <MainScreen />;
  }

  // 게임 시작 후: 비디오 또는 게임 화면
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
