import { Keyboard, Trophy } from 'lucide-react';
import { useEffect } from 'react';

function HomePage({ onStart, onShowLeaderboard }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <Keyboard className="w-16 h-16 text-gray-800" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
          Speed Typing
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          Testez votre vitesse et precision de frappe en 60 secondes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={onStart}
            className="bg-gray-900 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            Commencer
          </button>

          <button
            onClick={onShowLeaderboard}
            className="bg-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Appuyez sur Entree pour commencer
        </p>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-gray-400 text-xs">
            Fait par <span className="font-semibold text-gray-600">Colin</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
