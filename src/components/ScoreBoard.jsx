import { Trophy, Target, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

function ScoreBoard({ wpm, accuracy, onRestart, onShowLeaderboard }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const getAccuracyColor = (acc) => {
    if (acc >= 95) return 'text-green-600';
    if (acc >= 80) return 'text-blue-600';
    if (acc >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWpmMessage = (wpm) => {
    if (wpm >= 60) return 'Excellent !';
    if (wpm >= 40) return 'Tres bien !';
    if (wpm >= 25) return 'Pas mal !';
    return 'Continuez a pratiquer !';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Résultats
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          {getWpmMessage(wpm)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {wpm.toFixed(1)}
            </div>
            <div className="text-lg text-gray-600">
              Mots par minute
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className={`text-5xl font-bold mb-2 ${getAccuracyColor(accuracy)}`}>
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-lg text-gray-600">
              Précision
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={onRestart}
            className="bg-gray-900 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Rejouer
          </button>

          <button
            onClick={onShowLeaderboard}
            className="bg-yellow-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
          >
            <Trophy className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Appuyez sur Entree pour rejouer
        </p>
      </div>
    </div>
  );
}

export default ScoreBoard;
