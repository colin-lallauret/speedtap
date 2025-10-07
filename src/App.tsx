import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import Leaderboard from './components/Leaderboard';
import MobileWarning from './components/MobileWarning';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'game', 'leaderboard'
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'utilisateur est sur mobile
  useEffect(() => {
    const checkIfMobile = () => {
      // Vérifier la largeur de l'écran
      const isMobileWidth = window.innerWidth <= 768;
      
      // Vérifier le user agent
      const userAgent = navigator.userAgent || navigator.vendor || '';
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Vérifier si c'est un écran tactile
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Considérer comme mobile si au moins 2 conditions sont vraies
      const mobileIndicators = [isMobileWidth, isMobileDevice, isTouchDevice].filter(Boolean).length;
      setIsMobile(mobileIndicators >= 2);
    };

    checkIfMobile();
    
    // Réévaluer lors du redimensionnement de la fenêtre
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Si mobile, afficher uniquement l'avertissement
  if (isMobile) {
    return <MobileWarning />;
  }

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
