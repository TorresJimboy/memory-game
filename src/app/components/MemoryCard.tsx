import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MemoryCardProps {
  id: number;
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function MemoryCard({ icon: Icon, isFlipped, isMatched, onClick }: MemoryCardProps) {
  return (
    <motion.button
      className="relative w-full aspect-square cursor-pointer"
      onClick={onClick}
      disabled={isFlipped || isMatched}
      whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-xl shadow-lg"
        initial={false}
        animate={{
          rotateY: isFlipped || isMatched ? 180 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-darkblue-500 to-blue-400 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/30"></div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center ${
            isMatched ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-white'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Icon
            className={`w-12 h-12 ${isMatched ? 'text-white' : 'text-purple-600'}`}
            strokeWidth={2.5}
          />
        </div>
      </motion.div>
    </motion.button>
  );
}
