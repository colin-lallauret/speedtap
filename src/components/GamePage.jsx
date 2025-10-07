import { useState, useEffect } from 'react';
import TypingArea from './TypingArea';
import ScoreBoard from './ScoreBoard';
import NameInput from './NameInput';
import { scoreService } from '../lib/scoreService.js';

const GAME_DURATION = 60;

const SENTENCES = [
  "Le printemps arrive avec ses couleurs éclatantes et ses parfums délicieux. Les fleurs s'épanouissent dans les jardins, créant un spectacle magnifique pour les yeux émerveillés. Les oiseaux chantent joyeusement dans les arbres verdoyants, annonçant le réveil de la nature après l'hiver rigoureux. C'est une période de renouveau où la vie reprend ses droits avec une énergie débordante. Les promenades deviennent plus agréables et les journées s'allongent progressivement. Les bourgeons éclatent sur les branches, promettant de futures floraisons spectaculaires. L'air se réchauffe doucement, invitant chacun à sortir et profiter de cette renaissance saisonnière exceptionnelle.",
  "La cuisine française est réputée dans le monde entier pour sa finesse remarquable et sa diversité culinaire impressionnante. Chaque région possède ses spécialités gastronomiques uniques : la bouillabaisse marseillaise parfumée, le cassoulet toulousain généreux, la choucroute alsacienne traditionnelle. Les chefs français maîtrisent parfaitement l'art de sublimer les produits du terroir avec passion créative et technique irréprochable. C'est un patrimoine gastronomique exceptionnel qu'il faut absolument préserver pour les générations futures. Les marchés regorgent de produits frais et savoureux qui inspirent les cuisiniers amateurs comme professionnels. Cette richesse culinaire fait la fierté de notre pays à travers le monde.",
  "Voyager permet de découvrir d'autres cultures fascinantes et d'élargir considérablement ses horizons personnels. Chaque destination offre des expériences uniques et enrichissantes : architecture historique impressionnante, paysages naturels à couper le souffle, rencontres humaines authentiques et mémorables. Les souvenirs de voyage restent gravés profondément dans la mémoire longtemps après le retour au foyer. C'est une façon merveilleuse d'apprendre continuellement et de grandir personnellement à travers les découvertes. Les différences culturelles nous enseignent la tolérance et l'ouverture d'esprit nécessaires. Chaque périple transforme notre vision du monde et enrichit notre compréhension des autres civilisations remarquables.",
  "L'art sous toutes ses formes diverses nourrit profondément l'ame humaine et stimule puissamment l'imagination créatrice. Que ce soit la peinture expressive, la sculpture monumentale, la musique harmonieuse ou la littérature inspirante, chaque discipline artistique apporte sa richesse particulière et son langage unique. Les artistes talentueux expriment leurs émotions intenses à travers leurs œuvres personnelles, créant des ponts invisibles entre les générations successives. L'art transcende naturellement les frontières géographiques et unit les peuples dans une même admiration partagée. Les musées conservent précieusement ces trésors artistiques pour l'éducation des visiteurs curieux. Cette expression créative universelle révèle la beauté cachée du monde qui nous entoure quotidiennement.",
  "L'amitié véritable représente un trésor précieux qui enrichit considérablement notre existence quotidienne et lui donne sens. Les vrais amis fidèles nous accompagnent loyalement dans les moments joyeux comme dans les épreuves difficiles de la vie. Ils nous écoutent attentivement sans jamais juger et nous soutiennent inconditionnellement dans nos projets les plus ambitieux. Ces relations privilégiées se construisent patiemment avec le temps, la confiance mutuelle sincère et le respect réciproque constant. L'entraide spontanée caractérise ces liens exceptionnels qui résistent aux tempêtes existentielles. Une amitié solide apporte réconfort et bonheur partagé dans les moments importants. Ces connexions humaines authentiques donnent couleur et saveur à notre parcours terrestre.",
  "La lecture ouvre largement les portes de mondes imaginaires extraordinaires et enrichit considérablement nos connaissances générales diversifiées. Chaque livre découvert apporte de nouvelles perspectives stimulantes et développe notre réflexion personnelle approfondie. Les bibliothèques regorgent de trésors littéraires inestimables qui n'attendent patiemment que d'être découverts par les lecteurs passionnés. C'est un plaisir accessible facilement à tous qui développe efficacement l'esprit critique et la sensibilité artistique raffinée. Les auteurs talentueux nous transportent dans leurs univers créatifs à travers leurs mots choisis. Cette activité intellectuelle stimulante nourrit notre curiosité naturelle et élargit notre compréhension du monde complexe. Les histoires captivantes nous permettent de vivre mille vies différentes."
];

function GamePage({ onBackToHome, onShowLeaderboard }) {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [finalScores, setFinalScores] = useState({ wpm: 0, accuracy: 0 });

  useEffect(() => {
    const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setText(randomSentence);
  }, []);

  useEffect(() => {
    if (!hasStarted || !isGameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          // Calculer les scores finaux
          const finalWpm = calculateWPM();
          const finalAccuracy = calculateAccuracy();
          setFinalScores({ wpm: finalWpm, accuracy: finalAccuracy });
          
          // Vérifier si c'est un top score
          scoreService.isTopScore(finalWpm, finalAccuracy)
            .then(isTop => {
              if (isTop) {
                setShowNameInput(true);
              } else {
                saveScore(finalWpm, finalAccuracy).catch(console.error);
                setShowScore(true);
              }
            })
            .catch(() => {
              // En cas d'erreur, sauvegarder directement
              saveScore(finalWpm, finalAccuracy).catch(console.error);
              setShowScore(true);
            });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isGameActive, timeLeft]);

  const handleKeyPress = (key) => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    if (!isGameActive) return;

    const expectedChar = text[userInput.length];

    if (key === expectedChar) {
      const newInput = userInput + key;
      setUserInput(newInput);
      setCorrectChars((prev) => prev + 1);
      setTotalChars((prev) => prev + 1);
      setHasError(false); // Réinitialiser l'erreur si la saisie est correcte

      if (newInput === text) {
        setIsGameActive(false);
        setShowScore(true);
      }
    } else {
      setTotalChars((prev) => prev + 1);
      // Déclencher l'animation d'erreur
      setHasError(true);
      setTimeout(() => setHasError(false), 500); // L'animation dure 500ms
    }
  };

  const calculateWPM = () => {
    const timeElapsed = GAME_DURATION - timeLeft;
    const words = correctChars / 5;
    const minutes = timeElapsed / 60;
    return minutes > 0 ? Math.round((words / minutes) * 10) / 10 : 0;
  };

  const calculateAccuracy = () => {
    if (totalChars === 0) return 0;
    return Math.round(((correctChars / totalChars) * 100) * 10) / 10;
  };

  const saveScore = async (wpm, accuracy, playerName = null) => {
    await scoreService.saveScore(wpm, accuracy, playerName);
  };

  const handleNameSubmit = async (playerName) => {
    await saveScore(finalScores.wpm, finalScores.accuracy, playerName);
    setShowNameInput(false);
    setShowScore(true);
  };

  const handleNameSkip = async () => {
    await saveScore(finalScores.wpm, finalScores.accuracy);
    setShowNameInput(false);
    setShowScore(true);
  };

  const handleRestart = () => {
    const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setText(randomSentence);
    setUserInput('');
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setHasStarted(false);
    setShowScore(false);
    setShowNameInput(false);
    setCorrectChars(0);
    setTotalChars(0);
    setHasError(false);
    setFinalScores({ wpm: 0, accuracy: 0 });
  };

  if (showNameInput) {
    return (
      <NameInput
        wpm={finalScores.wpm}
        accuracy={finalScores.accuracy}
        onSubmit={handleNameSubmit}
        onSkip={handleNameSkip}
      />
    );
  }

  if (showScore) {
    return (
      <ScoreBoard
        wpm={finalScores.wpm}
        accuracy={finalScores.accuracy}
        onRestart={handleRestart}
        onShowLeaderboard={onShowLeaderboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <TypingArea
          text={text}
          userInput={userInput}
          onKeyPress={handleKeyPress}
          timeLeft={timeLeft}
          isGameActive={isGameActive}
          onRestart={handleRestart}
          hasError={hasError}
        />
      </div>
    </div>
  );
}

export default GamePage;
