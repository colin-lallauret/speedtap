import { Monitor, Smartphone } from 'lucide-react';

function MobileWarning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 flex justify-center gap-4">
          <div className="bg-red-500 p-4 rounded-full shadow-lg animate-pulse">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-center">
            <span className="text-4xl text-white">→</span>
          </div>
          <div className="bg-green-500 p-4 rounded-full shadow-lg">
            <Monitor className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          SpeedTap
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ⚠️ Appareil mobile détecté
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
            Ce jeu de frappe nécessite un clavier physique pour fonctionner correctement.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-blue-900 dark:text-blue-100 font-semibold">
              Veuillez utiliser un ordinateur de bureau ou un ordinateur portable pour jouer.
            </p>
          </div>

          <div className="text-left text-gray-600 dark:text-gray-300 space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Ordinateur de bureau</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Ordinateur portable</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Smartphone</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Tablette</span>
            </p>
          </div>
        </div>

        <p className="text-gray-300 dark:text-gray-400 text-sm">
          Merci de votre compréhension ! 🎮⌨️
        </p>
      </div>
    </div>
  );
}

export default MobileWarning;
