import { useState, useEffect } from 'react';
import TypingArea from './TypingArea';
import ScoreBoard from './ScoreBoard';
import NameInput from './NameInput';
import { scoreService } from '../lib/scoreService.js';

const GAME_DURATION = 60;

const SENTENCES = [
  "Le printemps arrive avec ses couleurs éclatantes et ses parfums délicieux. Les fleurs s'épanouissent dans les jardins, créant un spectacle magnifique pour les yeux émerveillés. Les oiseaux chantent joyeusement dans les arbres verdoyants, annonçant le réveil de la nature après l'hiver rigoureux. C'est une période de renouveau où la vie reprend ses droits avec une énergie débordante. Les promenades deviennent plus agréables et les journées s'allongent progressivement. Les bourgeons éclatent sur les branches, promettant de futures floraisons spectaculaires. L'air se réchauffe doucement, invitant chacun à sortir et profiter de cette renaissance saisonnière exceptionnelle.",
  
  "La cuisine française est réputée dans le monde entier pour sa finesse remarquable et sa diversité culinaire impressionnante. Chaque région possède ses spécialités gastronomiques uniques : la bouillabaisse marseillaise parfumée, le cassoulet toulousain généreux, la choucroute alsacienne traditionnelle. Les chefs français maitrisent parfaitement l'art de sublimer les produits du terroir avec passion créative et technique irréprochable. C'est un patrimoine gastronomique exceptionnel qu'il faut absolument préserver pour les générations futures. Les marchés regorgent de produits frais et savoureux qui inspirent les cuisiniers amateurs comme professionnels. Cette richesse culinaire fait la fierté de notre pays à travers le monde.",
  
  "Voyager permet de découvrir d'autres cultures fascinantes et d'élargir considérablement ses horizons personnels. Chaque destination offre des expériences uniques et enrichissantes : architecture historique impressionnante, paysages naturels à couper le souffle, rencontres humaines authentiques et mémorables. Les souvenirs de voyage restent gravés profondément dans la mémoire longtemps après le retour au foyer. C'est une façon merveilleuse d'apprendre continuellement et de grandir personnellement à travers les découvertes. Les différences culturelles nous enseignent la tolérance et l'ouverture d'esprit nécessaires. Chaque périple transforme notre vision du monde et enrichit notre compréhension des autres civilisations remarquables.",
  
  "L'art sous toutes ses formes diverses nourrit profondément l'ame humaine et stimule puissamment l'imagination créatrice. Que ce soit la peinture expressive, la sculpture monumentale, la musique harmonieuse ou la littérature inspirante, chaque discipline artistique apporte sa richesse particulière et son langage unique. Les artistes talentueux expriment leurs émotions intenses à travers leurs œuvres personnelles, créant des ponts invisibles entre les générations successives. L'art transcende naturellement les frontières géographiques et unit les peuples dans une même admiration partagée. Les musées conservent précieusement ces trésors artistiques pour l'éducation des visiteurs curieux. Cette expression créative universelle révèle la beauté cachée du monde qui nous entoure quotidiennement.",
  
  "L'amitié véritable représente un trésor précieux qui enrichit considérablement notre existence quotidienne et lui donne sens. Les vrais amis fidèles nous accompagnent loyalement dans les moments joyeux comme dans les épreuves difficiles de la vie. Ils nous écoutent attentivement sans jamais juger et nous soutiennent inconditionnellement dans nos projets les plus ambitieux. Ces relations privilégiées se construisent patiemment avec le temps, la confiance mutuelle sincère et le respect réciproque constant. L'entraide spontanée caractérise ces liens exceptionnels qui résistent aux tempêtes existentielles. Une amitié solide apporte réconfort et bonheur partagé dans les moments importants. Ces connexions humaines authentiques donnent couleur et saveur à notre parcours terrestre.",
  
  "La lecture ouvre largement les portes de mondes imaginaires extraordinaires et enrichit considérablement nos connaissances générales diversifiées. Chaque livre découvert apporte de nouvelles perspectives stimulantes et développe notre réflexion personnelle approfondie. Les bibliothèques regorgent de trésors littéraires inestimables qui n'attendent patiemment que d'être découverts par les lecteurs passionnés. C'est un plaisir accessible facilement à tous qui développe efficacement l'esprit critique et la sensibilité artistique raffinée. Les auteurs talentueux nous transportent dans leurs univers créatifs à travers leurs mots choisis. Cette activité intellectuelle stimulante nourrit notre curiosité naturelle et élargit notre compréhension du monde complexe. Les histoires captivantes nous permettent de vivre mille vies différentes.",
  
  // --- NOUVEAUX TEXTES ---
  
  "L'océan immense fascine par sa beauté changeante et sa puissance infinie. Les vagues se succèdent avec un rythme apaisant, tandis que le vent salé caresse doucement le visage des promeneurs. Le bruit régulier de l'eau qui se brise contre les rochers crée une mélodie naturelle qui apaise l'esprit. Les mouettes planent au-dessus des flots, cherchant leur repas du jour, et le soleil joue sur la surface argentée de la mer. Regarder l'horizon procure une sensation de liberté totale et d'harmonie profonde avec la nature. C'est un spectacle vivant, éternel, qui rappelle la force tranquille du monde marin et la beauté simple des éléments.",
  
  "Les soirs d'été offrent une lumière dorée qui enveloppe doucement les paysages paisibles. Les arbres se découpent en ombre sur un ciel clair et chaud, tandis que les insectes chantent dans les herbes hautes. L'air sent la terre et les fleurs, empli d'une douceur que rien ne peut égaler. Les gens flanent dans les rues encore animées, savourant les dernières heures avant la nuit. Les rires, les voix et les pas résonnent dans les ruelles pleines de vie. Il y a dans ces instants une forme de bonheur simple, celle de sentir le temps ralentir et de profiter d'une soirée calme et lumineuse.",
  
  "Le matin dans une ville endormie est un moment rare et précieux. Les rues sont calmes, les vitrines encore fermées et l'air porte l'odeur du pain chaud. Quelques passants pressés traversent les trottoirs tandis que les oiseaux saluent le jour qui se lève. La lumière douce glisse sur les façades et fait briller les toits encore humides de rosée. C'est une heure discrète où le monde semble respirer lentement avant de s'agiter. Boire un café fumant en observant cette tranquillité procure un sentiment de sérénité pure et d'équilibre parfait. Chaque matin porte la promesse d'une journée nouvelle et pleine de possibilités.",
  
  "Les forêts anciennes abritent un mystère profond que l'on ressent dès que l'on y pénètre. La lumière filtre à travers les feuilles et dessine des taches mouvantes sur le sol couvert de mousse. Les troncs majestueux se dressent comme des gardiens silencieux de la nature. Le chant des oiseaux et le bruissement du vent composent une symphonie douce et apaisante. Marcher sur les sentiers humides procure une sensation de paix que l'on ne trouve nulle part ailleurs. Ces lieux préservent la mémoire du temps et rappellent à chacun la beauté simple de la vie sauvage et la force tranquille des arbres.",
  
  "La montagne impose le respect par sa grandeur et son silence majestueux. L'air y est pur, le vent y souffle librement, et chaque pas sur le sentier rapproche du ciel. Le soleil éclaire les pics enneigés qui se détachent sur un bleu éclatant. Le souffle devient plus court mais la joie grandit à mesure que l'on grimpe. Là-haut, le monde parait minuscule et paisible, comme si le temps s'était arrêté. Regarder la vallée depuis les hauteurs procure une émotion rare, celle de la liberté absolue. La montagne enseigne la patience, l'effort et la récompense de la persévérance.",
  
  "Les marchés du matin sont un spectacle vivant plein de couleurs et d'odeurs. Les étals débordent de fruits juteux, de légumes croquants et de fleurs fraiches. Les voix des marchands résonnent gaiement dans l'air clair, vantant la qualité de leurs produits. On y croise des habitants souriants, des enfants curieux et des paniers remplis de bonnes choses. Le café s'écoule sur les terrasses voisines pendant que le soleil réchauffe les pavés. Ce mélange d'énergie et de simplicité donne aux marchés une atmosphère unique et chaleureuse. C'est un lieu de partage, de rencontres et de plaisir sincère du quotidien.",
  
  "Un soir d'automne, le vent soulève les feuilles mortes et les fait danser dans la lumière dorée. Le parfum du bois brulé s'échappe des maisons et se mêle à l'air frais. Les arbres rougissent doucement avant de se dépouiller complètement. Les pas crissent sur les allées couvertes de feuilles et rappellent les promenades d'enfance. C'est une saison douce et mélancolique, pleine de couleurs chaudes et de calme intérieur. Les jours raccourcissent, invitant chacun à ralentir le rythme et à savourer la chaleur d'un foyer tranquille. L'automne est une poésie silencieuse, une transition paisible entre l'été et l'hiver.",
  
  "La musique a ce pouvoir magique de transformer l'instant le plus simple en moment exceptionnel. Quelques notes suffisent à évoquer un souvenir, une émotion ou une image enfouie. Chaque mélodie porte une histoire, chaque rythme raconte un voyage. Le piano, la guitare ou la voix humaine transmettent des sentiments qu'aucun mot ne saurait décrire. Écouter une chanson aimée, c'est comme retrouver une partie oubliée de soi. Les sons se mêlent à la mémoire et réchauffent le coeur. La musique accompagne nos vies, apaise nos peurs et réveille nos rêves les plus enfouis.",
  
  "La pluie a toujours eu quelque chose de réconfortant et de nostalgique. Elle tombe avec douceur sur les toits, les arbres et les vitres, dessinant des sillons éphémères sur le verre. Les passants pressent le pas, les parapluies s'ouvrent comme des fleurs colorées. L'air devient plus frais, les sons se font feutrés et le monde semble ralentir. Rester à l'intérieur et écouter cette mélodie de gouttes procure une paix rare. C'est un moment suspendu, une pause bienfaisante dans le tumulte des jours. La pluie rappelle que même les instants gris peuvent être pleins de beauté simple et de calme apaisant."
];


function GamePage({ onBackToHome, onShowLeaderboard }) {
  const [gameKey, setGameKey] = useState(0); // Pour forcer le remount des composants
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
    // Reset complet de tous les états à leurs valeurs initiales
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
    
    // Forcer le remount complet des composants
    setGameKey(prev => prev + 1);
    
    // Force le focus sur la zone de saisie pour recommencer immédiatement
    setTimeout(() => {
      const textInput = document.querySelector('textarea, input[type="text"]');
      if (textInput) {
        textInput.focus();
      }
    }, 100);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full">
        <TypingArea
          key={gameKey}
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
