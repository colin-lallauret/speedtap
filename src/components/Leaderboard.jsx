import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scoreService } from '../lib/scoreService.js';

function Leaderboard({ onBack }) {
  const [topScores, setTopScores] = useState([]);
  const [todayScores, setTodayScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState('');

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
        setLoading(true);
        setError(null);
        
        // Charger les scores de tous les temps et du jour en parallèle
        const [allTimeScores, dailyScores] = await Promise.all([
          scoreService.getTopScores(),
          scoreService.getTodayTopScores()
        ]);
        
        setTopScores(allTimeScores || []);
        setTodayScores(dailyScores || []);
      } catch (error) {
        console.error('Erreur lors du chargement des scores:', error);
        setError('Impossible de charger les scores. Veuillez réessayer.');
        setTopScores([]);
        setTodayScores([]);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, []);

  // Timer pour le reset des scores 24h
  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilReset(calculateTimeUntilReset());
    };

    // Mettre à jour immédiatement
    updateTimer();

    // Puis mettre à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
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

  const calculateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Minuit du jour suivant
    
    const diff = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-4xl w-full">
        <div className="mb-8 flex justify-center">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-full shadow-lg">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Classement
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Classements des meilleurs scores
        </p>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              Chargement des scores...
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8">
            <div className="text-red-500 dark:text-red-400 text-lg">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        ) : topScores.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun score enregistré pour le moment.
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Jouez une partie pour voir vos résultats ici !
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 du jour - Dernières 24h */}
            <div className="mb-12">
              <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🔥 DERNIÈRES 24H
                </div>
                <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-mono">
                  ⏰ Reset dans {timeUntilReset}
                </div>
              </div>
              
              {!todayScores || todayScores.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 text-lg">
                    Aucun score aujourd'hui
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Soyez le premier à jouer aujourd'hui !
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {(todayScores || []).slice(0, 3).map((score, index) => (
                    <div
                      key={`today-${index}`}
                      className={`bg-gradient-to-br ${getPodiumColor(index + 1)} rounded-xl shadow-lg p-4 text-white transform ${
                        index === 0 ? 'md:scale-105' : ''
                      }`}
                    >
                      <div className="flex justify-center mb-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-full">
                          {getPodiumIcon(index + 1)}
                        </div>
                      </div>

                      <div className="text-lg font-bold mb-1 text-center">
                        #{index + 1}
                      </div>

                      {score.playerName && (
                        <div className="text-sm font-semibold mb-2 opacity-90 text-center">
                          {score.playerName}
                        </div>
                      )}

                      <div className="text-2xl font-bold mb-1 text-center">
                        {score.wpm.toFixed(1)}
                      </div>
                      <div className="text-xs opacity-90 mb-2 text-center">
                        mots par minute
                      </div>

                      <div className="text-lg font-semibold mb-1 text-center">
                        {score.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs opacity-90 text-center">
                        précision
                      </div>
                    </div>
                  ))}

                  {/* Remplir les positions vides du podium du jour */}
                  {Array.from({ length: Math.max(0, 3 - (todayScores?.length || 0)) }, (_, index) => (
                    <div
                      key={`today-empty-${index}`}
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg p-4 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-full">
                          {getPodiumIcon(todayScores.length + index + 1)}
                        </div>
                      </div>

                      <div className="text-lg font-bold mb-3 text-center">
                        #{(todayScores?.length || 0) + index + 1}
                      </div>

                      <div className="text-sm text-center">
                        Position libre
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Séparateur */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🏆 CLASSEMENT GÉNÉRAL
              </div>
            </div>

            {/* Top 3 - Affichage podium de tous les temps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {topScores.slice(0, 3).map((score, index) => (
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

              {/* Remplir les positions vides du podium */}
              {Array.from({ length: Math.max(0, 3 - topScores.length) }, (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-xl p-6 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-full">
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

            {/* Top 4-10 - Affichage tableau */}
            {topScores.length > 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Rang</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Joueur</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">WPM</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Précision</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {topScores.slice(3).map((score, index) => (
                        <tr key={index + 3} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{index + 4}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {score.playerName || 'Anonyme'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-blue-600 dark:text-blue-400">
                            {score.wpm.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-medium text-green-600 dark:text-green-400">
                            {score.accuracy.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                            {formatDate(score.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={onBack}
          className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
          Appuyez sur Échap pour revenir
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
