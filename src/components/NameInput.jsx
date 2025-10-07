import { useState, useEffect } from 'react';
import { Trophy, User } from 'lucide-react';
import confetti from 'canvas-confetti';

function NameInput({ wpm, accuracy, onSubmit, onSkip }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déclencher l'animation de confettis au montage du composant
  useEffect(() => {
    // Animation initiale de confettis
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confettis depuis la gauche
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Confettis depuis la droite
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && name.trim()) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [name, onSkip]);

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await onSubmit(name.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Félicitations !
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          Vous avez fait un excellent score !
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {wpm.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                mots/min
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {accuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                précision
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Entrez votre prénom pour apparaître dans le classement :
          </p>

          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))} // Limiter à 20 caractères
              placeholder="Votre prénom..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              autoFocus
              maxLength={20}
            />
          </div>

          <div className="text-xs text-gray-500 mb-6">
            Maximum 20 caractères
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
            
            <button
              onClick={onSkip}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transform hover:scale-105 transition-all duration-200"
            >
              Passer
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          Appuyez sur Entrée pour valider ou Échap pour passer
        </p>
      </div>
    </div>
  );
}

export default NameInput;
