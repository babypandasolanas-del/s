import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, Crown, ArrowRight, Zap } from 'lucide-react';
import { getRankDescription, generateDailyQuests } from '../data/questSystem';
import RankBadge from '../components/RankBadge';
import GlowingCard from '../components/GlowingCard';
import { useAuth } from '../hooks/useAuth';

interface RankRevealProps {
  rank: string;
  totalScore: number;
  onContinue: (dailyQuests: any[]) => void;
}

const RankReveal: React.FC<RankRevealProps> = ({ rank, totalScore, onContinue }) => {
  const [showQuests, setShowQuests] = useState(false);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);
  const { userName } = useAuth();

  useEffect(() => {
    // Generate daily quests after rank reveal
    const quests = generateDailyQuests(rank as any);
    setDailyQuests(quests);
  }, [rank]);

  const handleContinue = () => {
    if (!showQuests) {
      setShowQuests(true);
    } else {
      onContinue(dailyQuests);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        {!showQuests ? (
          // Rank Reveal Animation
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1, type: "spring" }}
              className="mb-8"
            >
              <div className="inline-block p-12 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full border-4 border-electric-blue shadow-glow-strong">
                <Crown className="w-24 h-24 text-electric-blue" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-6xl font-orbitron font-black text-white mb-6 text-glow-strong"
            >
              RANK REVEALED
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-block transform scale-150">
                <RankBadge rank={rank as any} size="lg" glowing={true} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mb-8"
            >
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="text-3xl font-orbitron font-bold text-electric-blue mb-4 text-glow"
              >
                {userName}, you achieved Rank {rank}!
              </motion.h2>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                {getRankDescription(rank as any)}
              </h3>
              <div className="text-xl font-orbitron text-white/90 text-glow">
                Assessment Score: <span className="text-electric-blue font-bold">{totalScore}/150</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <GlowingCard className="max-w-2xl mx-auto mb-8">
                <div className="text-center">
                  <Sword className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                    Your Journey Begins
                  </h3>
                  <p className="text-white/80 font-orbitron leading-relaxed mb-6">
                    Every hunter starts somewhere. Your rank reflects your current state, 
                    but through daily quests and unwavering discipline, you can transcend 
                    your limits and reach heights you never imagined.
                  </p>
                  <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-4">
                    <p className="text-electric-blue font-orbitron font-semibold text-glow">
                      "The path of a hunter is not about where you start, but how far you're willing to go."
                    </p>
                  </div>
                </div>
              </GlowingCard>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                         text-white font-orbitron font-bold text-xl rounded-xl
                         shadow-glow-strong hover:shadow-electric-blue/25 
                         border border-electric-blue/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Generate Daily Quest Scroll
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          // Daily Quest Scroll
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl font-orbitron font-bold text-white mb-8 text-glow-strong"
            >
              📜 DAILY QUEST SCROLL
            </motion.h1>

            <GlowingCard className="max-w-3xl mx-auto mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-lg border border-electric-blue/40">
                  <RankBadge rank={rank as any} size="sm" />
                  <span className="text-electric-blue font-orbitron font-bold text-glow">HUNTER MISSIONS</span>
                </div>
              </div>

              <div className="space-y-4">
                {dailyQuests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <h4 className="font-orbitron font-bold text-white mb-2 text-glow">
                          {quest.title}
                        </h4>
                        <p className="text-white/80 font-orbitron text-sm mb-2">
                          {quest.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-electric-blue font-orbitron uppercase tracking-wider font-semibold">
                            {quest.category}
                          </span>
                          <span className="text-xs text-electric-blue font-orbitron font-bold">
                            +{quest.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <div className="text-electric-blue">
                        <Sword className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg">
                <h4 className="text-electric-blue font-orbitron font-bold text-lg mb-3 text-glow">
                  Hunter's Code:
                </h4>
                <div className="text-white/90 font-orbitron text-sm space-y-2">
                  <p>• Complete all 3 missions daily to maintain your streak</p>
                  <p>• Each completed day brings you closer to the next rank</p>
                  <p>• Missing 3 consecutive days will result in rank demotion</p>
                  <p>• True hunters never give up, no matter how difficult the path</p>
                </div>
              </div>
            </GlowingCard>

            <div className="mb-8">
              <p className="text-2xl font-orbitron font-bold text-electric-blue text-glow mb-4">
                "Hunter, your path has begun. Complete your quests to level up."
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                       text-white font-orbitron font-bold text-xl rounded-xl
                       shadow-glow-strong hover:shadow-electric-blue/25 
                       border border-electric-blue/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                Begin Hunter Journey
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RankReveal;