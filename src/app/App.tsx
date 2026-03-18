import { useState, useEffect } from 'react';
import { MemoryCard } from './components/MemoryCard';
import { Button } from './components/ui/button';
import { Heart, Star, Zap, Crown, Flame, Sparkles, Trophy, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';
import bgImage from '../assets/game-bg.avif';

interface Card {
  id: number;
  iconId: number;
  icon: typeof Heart;
  isFlipped: boolean;
  isMatched: boolean;
}

const icons = [Heart, Star, Zap, Crown, Flame, Sparkles, Trophy, Gem];

function createDeck(): Card[] {
  const deck: Card[] = [];
  icons.forEach((icon, index) => {
    // Create two cards for each icon (a pair)
    deck.push({
      id: index * 2,
      iconId: index,
      icon,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      id: index * 2 + 1,
      iconId: index,
      icon,
      isFlipped: false,
      isMatched: false,
    });
  });
  // Shuffle the deck
  return deck.sort(() => Math.random() - 0.5);
}

export default function App() {
  const [cards, setCards] = useState<Card[]>(createDeck());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard && secondCard && firstCard.iconId === secondCard.iconId) {
        // Match found!
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === icons.length) {
      // Game won!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [matchedPairs]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === id);
    if (card && !card.isFlipped && !card.isMatched) {
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );
      setFlippedCards((prev) => [...prev, id]);
    }
  };

  const resetGame = () => {
    setCards(createDeck());
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
  };

  const isGameWon = matchedPairs === icons.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-cyan-300
          drop-shadow-[0_0_5px_#22d3ee]
          drop-shadow-[0_0_15px_#22d3ee]
          drop-shadow-[0_0_30px_#0ea5e9] mb-2">Memory Game</h1>
          <p className="text-white/90">Find all the matching pairs!</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-white/80 text-sm">Moves</p>
            <p className="text-white text-2xl font-bold">{moves}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-white/80 text-sm">Matches</p>
            <p className="text-white text-2xl font-bold">
              {matchedPairs} / {icons.length}
            </p>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              id={card.id}
              icon={card.icon}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        {/* Win Message & Reset Button */}
        {isGameWon && (
          <div className="text-center mb-4">
            <p className="text-white text-2xl font-bold mb-4">
              🎉 Congratulations! You won in {moves} moves!
            </p>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={resetGame}
            size="lg"
            className="bg-white text-cyan-600 hover:bg-white/90 font-bold"
          >
            {isGameWon ? 'Play Again' : 'Reset Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}
