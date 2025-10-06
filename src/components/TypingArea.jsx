import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

function TypingArea({ text, userInput, onKeyPress, timeLeft, isGameActive, onRestart, hasError }) {
  const textRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [textLines, setTextLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayStartLine, setDisplayStartLine] = useState(0);
  const MAX_VISIBLE_LINES = 4;
  useEffect(() => {
    if (!isGameActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        
        // Marquer qu'on est en train de taper
        setIsTyping(true);
        
        // Réinitialiser le timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Arrêter le mode "typing" après 500ms d'inactivité
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 500);
        
        onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isGameActive, onKeyPress]);

  // Calculer la position du curseur
  useEffect(() => {
    // Délai pour s'assurer que le DOM est mis à jour après l'animation
    setTimeout(() => {
      if (!textRef.current || textLines.length === 0) return;
      
      // Calculer sur quelle ligne se trouve le curseur
      let charCount = 0;
      let cursorLineIndex = 0;
      let positionInLine = userInput.length;

      for (let i = 0; i < textLines.length; i++) {
        const lineLength = textLines[i].length + (i < textLines.length - 1 ? 1 : 0);
        if (charCount + lineLength > userInput.length) {
          cursorLineIndex = i;
          positionInLine = userInput.length - charCount;
          break;
        }
        charCount += lineLength;
      }

      // Créer un élément temporaire pour mesurer la position
      const measureElement = document.createElement('div');
      measureElement.style.position = 'absolute';
      measureElement.style.visibility = 'hidden';
      measureElement.style.fontFamily = 'monospace';
      measureElement.style.fontSize = '1.5rem';
      measureElement.style.whiteSpace = 'nowrap';
      measureElement.style.padding = '0';
      measureElement.style.margin = '0';
      measureElement.style.lineHeight = 'normal';
      document.body.appendChild(measureElement);

      try {
        // Mesurer la position dans la ligne actuelle
        const lineText = textLines[cursorLineIndex];
        let textBeforeCursor = '';
        
        if (positionInLine <= lineText.length) {
          // Curseur dans la ligne courante
          textBeforeCursor = lineText.substring(0, positionInLine);
        } else {
          // Curseur sur l'espace après la ligne (positionInLine === lineText.length + 1)
          textBeforeCursor = lineText + ' ';
        }
        
        measureElement.textContent = textBeforeCursor.replace(/ /g, '\u00A0'); // Remplacer espaces par espaces insécables
        const leftPosition = measureElement.offsetWidth;

        // Calculer la position verticale relative à la zone visible
        const relativeLineIndex = cursorLineIndex - displayStartLine;
        const topPosition = relativeLineIndex * 48 + 12; // 48px par ligne + ajustement plus haut (12px au lieu de 18px)

        setCursorPosition({
          left: leftPosition,
          top: topPosition
        });
      } finally {
        document.body.removeChild(measureElement);
      }
    }, 100); // Délai plus long pour s'assurer que l'animation est terminée
  }, [userInput.length, textLines, displayStartLine]);

  // S'assurer que le curseur clignote quand le jeu n'est pas actif
  useEffect(() => {
    if (!isGameActive) {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [isGameActive]);

    // Divider le texte en lignes basé sur la largeur réelle
  useEffect(() => {
    if (!text) {
      setTextLines([]);
      return;
    }

    // Attendre que le conteneur soit rendu puis mesurer
    const measureLines = () => {
      if (!textRef.current) return;

      // Créer un élément de mesure temporaire avec les mêmes styles
      const measureElement = document.createElement('div');
      measureElement.style.position = 'absolute';
      measureElement.style.visibility = 'hidden';
      measureElement.style.fontFamily = 'monospace';
      measureElement.style.fontSize = '1.5rem'; // text-2xl
      measureElement.style.whiteSpace = 'nowrap';
      measureElement.style.padding = '0';
      measureElement.style.margin = '0';
      measureElement.style.lineHeight = 'normal';
      document.body.appendChild(measureElement);

      try {
        // Mesurer la largeur disponible du conteneur
        const containerWidth = textRef.current.offsetWidth - 40; // Marge de sécurité plus importante
        if (containerWidth <= 0) return; // Conteneur pas encore rendu
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine === '' ? word : currentLine + ' ' + word;
          
          // Mesurer la largeur réelle du texte de test
          measureElement.textContent = testLine;
          const testWidth = measureElement.offsetWidth;
          
          if (testWidth > containerWidth && currentLine !== '') {
            // La ligne est trop large, terminer la ligne actuelle
            lines.push(currentLine);
            currentLine = word;
          } else {
            // La ligne tient, continuer
            currentLine = testLine;
          }
        }

        if (currentLine !== '') {
          lines.push(currentLine);
        }

        setTextLines(lines);
      } finally {
        document.body.removeChild(measureElement);
      }
    };

    // Délai pour s'assurer que le DOM est rendu
    setTimeout(measureLines, 100);
  }, [text]);

  // Calculer la ligne actuelle et gérer le défilement
  useEffect(() => {
    if (textLines.length === 0) return;

    let charCount = 0;
    let lineIndex = 0;

    // Calculer sur quelle ligne on se trouve
    for (let i = 0; i < textLines.length; i++) {
      const lineLength = textLines[i].length + (i < textLines.length - 1 ? 1 : 0); // +1 pour l'espace
      if (charCount + lineLength > userInput.length) {
        lineIndex = i;
        break;
      }
      charCount += lineLength;
    }

    const previousLineIndex = currentLineIndex;
    setCurrentLineIndex(lineIndex);

    // Défilement dès la première ligne terminée
    if (lineIndex !== previousLineIndex && lineIndex > 0) {
      // Dès qu'on passe à la ligne 1, 2, 3, etc. → défiler
      setDisplayStartLine(lineIndex);
    }
  }, [userInput.length, textLines, currentLineIndex]);

  const renderText = () => {
    // Fallback : si pas de lignes, afficher le texte simple
    if (textLines.length === 0) {
      if (!text) return null;
      
      const chars = text.split('').map((char, index) => {
        let className = 'text-2xl transition-colors duration-100 relative';

        if (index < userInput.length) {
          className += userInput[index] === char
            ? ' text-green-600 font-semibold'
            : ' text-red-600 font-semibold';
        } else if (index === userInput.length && hasError) {
          className += ' text-white bg-red-500 animate-error-blink';
        } else {
          className += ' text-gray-900';
        }

        return (
          <span key={index} className={className} data-char-index={index}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });

      return (
        <div ref={textRef} className="relative w-full">
          <div className="whitespace-normal break-words overflow-wrap-anywhere" style={{ lineHeight: '3rem' }}>
            {chars}
          </div>
          {!hasError && (
            <span
              className={`absolute w-0.5 bg-black ${!isTyping ? 'animate-pulse' : ''}`}
              style={{
                left: `${cursorPosition.left}px`,
                top: `${cursorPosition.top + 2}px`, // Réduction de l'ajustement (2px au lieu de 6px)
                height: '1.5rem',
                transition: 'left 0.15s ease-out, top 0.15s ease-out',
                borderRadius: '1px'
              }}
            />
          )}
        </div>
      );
    }

    // Afficher seulement les lignes visibles (4 max)
    const visibleLines = textLines.slice(displayStartLine, displayStartLine + MAX_VISIBLE_LINES);
    let globalCharIndex = 0;

    // Calculer l'index de départ pour les lignes visibles
    for (let i = 0; i < displayStartLine; i++) {
      globalCharIndex += textLines[i].length + (i < textLines.length - 1 ? 1 : 0);
    }

    const lineElements = visibleLines.map((line, lineIdx) => {
      const actualLineIndex = displayStartLine + lineIdx;
      const lineChars = line.split('').map((char, charIdx) => {
        const globalIndex = globalCharIndex + charIdx;
        let className = 'text-2xl transition-colors duration-100 relative';

        if (globalIndex < userInput.length) {
          className += userInput[globalIndex] === char
            ? ' text-green-600 font-semibold'
            : ' text-red-600 font-semibold';
        } else if (globalIndex === userInput.length && hasError) {
          className += ' text-white bg-red-500 animate-error-blink';
        } else {
          className += ' text-gray-900';
        }

        return (
          <span key={globalIndex} className={className} data-char-index={globalIndex}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });

      // Ajouter l'espace entre les lignes (sauf pour la dernière ligne du texte)
      if (actualLineIndex < textLines.length - 1) {
        const spaceIndex = globalCharIndex + line.length;
        let spaceClassName = 'text-2xl transition-colors duration-100 relative';

        if (spaceIndex < userInput.length) {
          spaceClassName += userInput[spaceIndex] === ' '
            ? ' text-green-600 font-semibold'
            : ' text-red-600 font-semibold';
        } else if (spaceIndex === userInput.length && hasError) {
          spaceClassName += ' text-white bg-red-500 animate-error-blink';
        } else {
          spaceClassName += ' text-gray-900';
        }

        lineChars.push(
          <span key={spaceIndex} className={spaceClassName} data-char-index={spaceIndex}>
            {'\u00A0'}
          </span>
        );
      }

      globalCharIndex += line.length + (actualLineIndex < textLines.length - 1 ? 1 : 0);

      return (
        <div key={actualLineIndex} className="leading-relaxed">
          {lineChars}
        </div>
      );
    });

    return (
      <div ref={textRef} className="relative w-full">
        <div 
          className="break-words overflow-wrap-anywhere transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${displayStartLine * -3}rem)`, // Animation fluide du défilement - ajusté pour text-2xl + espacement
            lineHeight: '3rem' // Hauteur de ligne fixe correspondant à text-2xl + espacement
          }}
        >
          {textLines.slice(0, displayStartLine + MAX_VISIBLE_LINES + 2).map((line, lineIdx) => {
            let globalCharIndex = 0;
            
            // Calculer l'index de départ pour cette ligne
            for (let i = 0; i < lineIdx; i++) {
              globalCharIndex += textLines[i].length + (i < textLines.length - 1 ? 1 : 0);
            }

            const lineChars = line.split('').map((char, charIdx) => {
              const globalIndex = globalCharIndex + charIdx;
              let className = 'text-2xl transition-colors duration-100 relative';

              if (globalIndex < userInput.length) {
                className += userInput[globalIndex] === char
                  ? ' text-green-600 font-semibold'
                  : ' text-red-600 font-semibold';
              } else if (globalIndex === userInput.length && hasError) {
                className += ' text-white bg-red-500 animate-error-blink';
              } else {
                className += ' text-gray-900';
              }

              return (
                <span key={globalIndex} className={className} data-char-index={globalIndex}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            });

            // Ajouter l'espace entre les lignes (sauf pour la dernière ligne du texte)
            if (lineIdx < textLines.length - 1) {
              const spaceIndex = globalCharIndex + line.length;
              let spaceClassName = 'text-2xl transition-colors duration-100 relative';

              if (spaceIndex < userInput.length) {
                spaceClassName += userInput[spaceIndex] === ' '
                  ? ' text-green-600 font-semibold'
                  : ' text-red-600 font-semibold';
              } else if (spaceIndex === userInput.length && hasError) {
                spaceClassName += ' text-white bg-red-500 animate-error-blink';
              } else {
                spaceClassName += ' text-gray-900';
              }

              lineChars.push(
                <span key={spaceIndex} className={spaceClassName} data-char-index={spaceIndex}>
                  {'\u00A0'}
                </span>
              );
            }

            return (
              <div key={lineIdx} className="h-12 flex items-center">
                {lineChars}
              </div>
            );
          })}
        </div>
        {/* Curseur d'insertion avec position fluide - hauteur fixe */}
        {!hasError && (
          <span
            className={`absolute w-0.5 bg-black ${!isTyping ? 'animate-pulse' : ''}`}
            style={{
              left: `${cursorPosition.left}px`,
              top: `${cursorPosition.top}px`,
              height: '1.5rem',
              transition: 'left 0.15s ease-out, top 0.3s ease-out',
              borderRadius: '1px'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-gray-600 text-lg font-medium">
          Temps restant
        </div>
        <div className="flex items-center gap-6">
          <div className="text-4xl font-bold text-gray-900">
            {timeLeft}s
          </div>
          <button
            onClick={onRestart}
            className="bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Recommencer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 h-[200px] flex items-start">
        <div className="select-none font-mono w-full max-w-full overflow-hidden h-full">
          <div className="h-full overflow-hidden">
            {renderText()}
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-lg mt-4 text-center font-medium">
        Commencez a taper pour demarrer le chronometre
      </p>
    </div>
  );
}

export default TypingArea;
