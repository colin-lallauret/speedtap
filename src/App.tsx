import { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import Leaderboard from './components/Leaderboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'game', 'leaderboard'

  const handleStart = () => {
    setCurrentPage('game');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleShowLeaderboard = () => {
    setCurrentPage('leaderboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'game':
        return <GamePage onBackToHome={handleBackToHome} onShowLeaderboard={handleShowLeaderboard} />;
      case 'leaderboard':
        return <Leaderboard onBack={handleBackToHome} />;
      default:
        return <HomePage onStart={handleStart} onShowLeaderboard={handleShowLeaderboard} />;
    }
  };

  return <>{renderCurrentPage()}</>;
}

export default App;
