import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface HunterStreakProps {
  streakDays: number;
}

const motivationalQuotes = [
  "The dungeon never sleeps. Neither should your discipline.",
  "Every quest completed brings you closer to S-Rank.",
  "True hunters rise before dawn and train after dusk.",
  "Weakness is a choice. Strength is earned daily.",
  "The system rewards consistency, not intensity.",
  "Your streak is your shadow. Don't let it fade.",
  "Legends aren't born. They're forged through daily quests.",
  "The stronger you become, the harder the trials. Keep pushing.",
  "A hunter's greatest weapon is their unbreakable routine.",
  "Small daily wins create unstoppable momentum.",
  "Your future self is watching. Make them proud.",
  "The path to SS-Rank starts with today's quest.",
  "Discipline today, dominance tomorrow.",
  "Every day you miss is a gift to your competition.",
  "The grind never stops. Neither should you."
];

const HunterStreak: React.FC<HunterStreakProps> = ({ streakDays }) => {
  const dailyQuote = useMemo(() => {
    const today = new Date().getDate();
    return motivationalQuotes[today % motivationalQuotes.length];
  }, []);

  const xpBoost = Math.min(Math.floor(streakDays / 7) * 2, 20);
  const flameIntensity = Math.min(streakDays / 30, 1);

  const getStreakColor = () => {
    if (streakDays >= 30) return '#F59E0B';
    if (streakDays >= 14) return '#EC4899';
    if (streakDays >= 7) return '#9333EA';
    return '#00f0ff';
  };

  const streakColor = getStreakColor();

  return (
    <div className="relative">
      {/* Flame container */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Flame glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              backgroundColor: streakColor,
              opacity: 0.4 + (flameIntensity * 0.4)
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Flame icon */}
          <motion.div
            animate={{
              y: [-2, 2, -2],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Flame
              className="w-12 h-12 relative z-10"
              style={{
                color: streakColor,
                filter: `drop-shadow(0 0 10px ${streakColor})`
              }}
              fill={streakColor}
            />
          </motion.div>

          {/* Fire particles */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: streakColor,
                left: '50%',
                top: '50%'
              }}
              animate={{
                y: [-20, -40],
                x: [0, (Math.random() - 0.5) * 20],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>

        {/* Streak info */}
        <div className="flex-1">
          <motion.div
            className="text-3xl font-orbitron font-bold"
            style={{
              color: streakColor,
              textShadow: `0 0 20px ${streakColor}`
            }}
            animate={{
              textShadow: [
                `0 0 20px ${streakColor}`,
                `0 0 30px ${streakColor}`,
                `0 0 20px ${streakColor}`
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {streakDays} Day{streakDays !== 1 ? 's' : ''}
          </motion.div>
          <div className="text-sm font-orbitron text-white/70">
            Hunter Streak
          </div>
          {xpBoost > 0 && (
            <motion.div
              className="mt-1 text-xs font-orbitron font-bold"
              style={{ color: streakColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🔥 +{xpBoost}% XP Boost Active
            </motion.div>
          )}
        </div>
      </div>

      {/* Streak milestones */}
      <div className="flex items-center gap-2 mb-4">
        {[7, 14, 30, 60, 90].map((milestone) => {
          const achieved = streakDays >= milestone;
          return (
            <motion.div
              key={milestone}
              className={`flex-1 h-2 rounded-full relative overflow-hidden ${
                achieved ? 'bg-gradient-to-r from-electric-blue to-purple-500' : 'bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {achieved && (
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-orbitron text-white/50">
                {milestone}d
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Daily motivational quote */}
      <motion.div
        className="relative p-4 rounded-lg border border-electric-blue/20 bg-[#0d0d1a]/40 backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-electric-blue to-purple-500 rounded-full" />
        <div className="text-xs font-orbitron text-electric-blue mb-1">
          HUNTER TIP
        </div>
        <div className="text-sm font-orbitron text-white/80 italic leading-relaxed">
          "{dailyQuote}"
        </div>
      </motion.div>
    </div>
  );
};

export default HunterStreak;
