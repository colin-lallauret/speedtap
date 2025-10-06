import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scoreService } from '../lib/scoreService.js';

function Leaderboard({ onBack }) {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const scores = await scoreService.getTopScores();
        setTopScores(scores);
      } catch (error) {
        console.error('Erreur lors du chargement des scores:', error);
        setTopScores([]);
      }
    };

    loadScores();
  }, []);

  const getPodiumIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-600" />;
      default:
        return null;
    }
  };

  const getPodiumColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-200 to-gray-400';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl w-full">
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Classement
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          Top 3 des meilleurs scores
        </p>

        {topScores.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
            <div className="text-gray-500 text-lg">
              Aucun score enregistré pour le moment.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Jouez une partie pour voir vos résultats ici !
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topScores.map((score, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${getPodiumColor(index + 1)} rounded-2xl shadow-xl p-6 text-white transform ${
                  index === 0 ? 'md:scale-110' : ''
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    {getPodiumIcon(index + 1)}
                  </div>
                </div>

                <div className="text-2xl font-bold mb-2">
                  #{index + 1}
                </div>

                {score.playerName && (
                  <div className="text-lg font-semibold mb-3 opacity-90">
                    {score.playerName}
                  </div>
                )}

                <div className="text-4xl font-bold mb-2">
                  {score.wpm.toFixed(1)}
                </div>
                <div className="text-sm opacity-90 mb-3">
                  mots par minute
                </div>

                <div className="text-2xl font-semibold mb-2">
                  {score.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90 mb-4">
                  précision
                </div>

                <div className="text-xs opacity-75">
                  {formatDate(score.date)}
                </div>
              </div>
            ))}

            {/* Remplir les positions vides */}
            {Array.from({ length: 3 - topScores.length }, (_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-200 rounded-2xl shadow-xl p-6 text-gray-400 border-2 border-dashed border-gray-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    {getPodiumIcon(topScores.length + index + 1)}
                  </div>
                </div>

                <div className="text-2xl font-bold mb-4">
                  #{topScores.length + index + 1}
                </div>

                <div className="text-lg">
                  Position libre
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onBack}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <p className="text-gray-500 text-sm mt-6">
          Appuyez sur Échap pour revenir
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
