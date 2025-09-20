import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sword, 
  Target, 
  Users, 
  Crown,
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Shield
} from 'lucide-react';
import { generateDailyQuests } from '../data/questSystem';
import { getXpRequiredForNextRank, getNextRank } from '../data/questSystem';
import GlowingCard from '../components/GlowingCard';
import RankBadge from '../components/RankBadge';
import ProgressBar from '../components/ProgressBar';
import SystemNotification from '../components/SystemNotification';
import NotificationSetup from '../components/NotificationSetup';
import DiscordButton from '../components/DiscordButton';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';

interface HunterDashboardProps {
  rank: string;
  totalScore: number;
  streak: number;
  totalXp: number;
  onUpdateProgress: (newXp: number, newStreak: number) => void;
}

const HunterDashboard: React.FC<HunterDashboardProps> = ({ 
  rank, 
  totalScore, 
  streak, 
  totalXp,
  onUpdateProgress 
}) => {
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);
  const { userName } = useAuth();
  const { sendNotification, sendRankUp, scheduleQuestReminder } = useNotifications();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'warning' | 'achievement';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setDailyQuests(generateDailyQuests(rank as any));
    scheduleQuestReminder();
  }, [rank]);

  const showNotification = (message: string, type: 'success' | 'warning' | 'achievement') => {
    setNotification({ show: true, message, type });
    
    if (type === 'success') {
      sendNotification('⚔️ Quest Complete!', {
        body: message,
        tag: 'quest-complete'
      });
    }
  };

  const showSoloLevelingNotification = () => {
    setNotification({ 
      show: true, 
      message: 'Your heart will stop in 0.02 seconds if you choose not to accept. Will you accept?', 
      type: 'warning' 
    });
  };

  const completeQuest = (questId: string) => {
    setDailyQuests(quests => 
      quests.map(quest => {
        if (quest.id === questId && !quest.completed) {
          const newXp = totalXp + quest.xpReward;
          const newStreak = streak + (quests.filter(q => q.completed).length === 2 ? 1 : 0); // Increment streak when all quests done
          
          showNotification(
            `⚔️ Quest Complete! You gained +${quest.xpReward} XP`, 
            'success'
          );
          
          onUpdateProgress(newXp, newStreak);
          
          return { ...quest, completed: true };
        }
        return quest;
      })
    );
  };

  const completedQuests = dailyQuests.filter(q => q.completed).length;
  const allQuestsComplete = completedQuests === dailyQuests.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <SystemNotification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            ⚔️ HUNTER SYSTEM
          </h1>
          <div className="flex items-center justify-center gap-4">
            <RankBadge rank={rank as any} size="lg" />
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-electric-blue font-orbitron text-xl text-glow"
            >
              Welcome back, {userName}
            </motion.p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notification Setup */}
            <NotificationSetup />
            
            {/* Hunter Stats */}
            <GlowingCard>
              <div className="text-center">
                <Shield className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                  Hunter Profile
                </h3>
                
                {/* Current Rank Display */}
                <div className="mb-4">
                  <RankBadge rank={rank as any} size="lg" />
                </div>
                
                <div className="space-y-3">
                  {/* Current Rank */}
                  <div className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-3">
                    <div className="text-electric-blue font-orbitron text-sm mb-1">Current Rank</div>
                    <div className="text-xl font-orbitron font-bold text-white text-glow">{rank}</div>
                  </div>
                  
                  {/* Next Rank */}
                  {(() => {
                    const nextRank = getNextRank(rank as any);
                    return nextRank ? (
                      <div className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-3">
                        <div className="text-electric-blue font-orbitron text-sm mb-1">Next Rank</div>
                        <div className="text-xl font-orbitron font-bold text-white text-glow">{nextRank}</div>
                      </div>
                    ) : (
                      <div className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-3">
                        <div className="text-electric-blue font-orbitron text-sm mb-1">Status</div>
                        <div className="text-lg font-orbitron font-bold text-white text-glow">MAX RANK</div>
                      </div>
                    );
                  })()}
                  
                  {/* XP Progress */}
                  <div className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-3">
                    <div className="text-electric-blue font-orbitron text-sm mb-1">Total XP</div>
                    <div className="text-xl font-orbitron font-bold text-white text-glow">{totalXp}</div>
                  </div>
                  
                  {/* Rank Progress Bar */}
                  {(() => {
                    const nextRank = getNextRank(rank as any);
                    if (!nextRank) {
                      return (
                        <div className="text-center py-2">
                          <div className="text-electric-blue font-orbitron text-sm text-glow">
                            🏆 Maximum Rank Achieved
                          </div>
                        </div>
                      );
                    }
                    
                    const currentRankXp = getXpRequiredForNextRank(rank as any);
                    const progress = Math.min((totalXp / currentRankXp) * 100, 100);
                    
                    return (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-electric-blue font-orbitron text-sm">Progress to {nextRank}</span>
                          <span className="text-electric-blue font-orbitron text-sm">{totalXp}/{currentRankXp} XP</span>
                        </div>
                        <ProgressBar
                          current={totalXp}
                          max={currentRankXp}
                          showNumbers={false}
                        />
                        <div className="text-center mt-1">
                          <span className="text-electric-blue font-orbitron text-xs">
                            {Math.round(progress)}% Complete
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  </div>
                </div>
              </div>
            </GlowingCard>

            {/* Streak Counter */}
            <div className="grid grid-cols-2 gap-4">
              <GlowingCard hover={false}>
                <div className="text-center">
                  <Flame className="w-8 h-8 text-electric-blue mx-auto mb-2" />
                  <div className="text-2xl font-orbitron font-bold text-white text-glow">{streak}</div>
                  <div className="text-electric-blue font-orbitron text-sm">Day Streak</div>
                </div>
              </GlowingCard>
              
              <GlowingCard hover={false}>
                <div className="text-center">
                  <Award className="w-8 h-8 text-electric-blue mx-auto mb-2" />
                  <div className="text-2xl font-orbitron font-bold text-white text-glow">{completedQuests}</div>
                  <div className="text-electric-blue font-orbitron text-sm">Quests Done</div>
                </div>
              </GlowingCard>
            </div>

            {/* Rank Progress */}
            <GlowingCard>
              <h3 className="text-lg font-orbitron font-bold text-white mb-4 text-glow">
                Rank Progress
              </h3>
              <div className="text-center mb-4">
                <p className="text-electric-blue font-orbitron text-sm">
                  Complete daily quests to advance your rank
                </p>
              </div>
              <ProgressBar
                current={streak}
                max={30}
                label="Days to Next Rank"
              />
            </GlowingCard>
          </div>

          {/* Right Column - Daily Quests */}
          <div className="lg:col-span-2">
            <GlowingCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3 text-glow">
                  <Target className="w-8 h-8 text-electric-blue" />
                  Daily Quest Scroll
                </h3>
                <div className="text-electric-blue font-orbitron text-lg">
                  {completedQuests} / 6 Complete
                </div>
              </div>

              <div className="space-y-4">
                {dailyQuests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-6 rounded-lg border-2 transition-all duration-300
                      ${quest.completed 
                        ? 'bg-green-500/10 border-green-400/50' 
                        : 'bg-navy-dark/50 border-electric-blue/30 hover:border-electric-blue/60'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Sword className="w-5 h-5 text-electric-blue" />
                          <h4 className="font-orbitron font-bold text-white text-lg text-glow">
                            {quest.title}
                          </h4>
                        </div>
                        <p className="text-white/80 font-orbitron mb-3 leading-relaxed">
                          {quest.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-electric-blue font-orbitron uppercase tracking-wider font-semibold bg-electric-blue/10 px-2 py-1 rounded">
                            {quest.category}
                          </span>
                          <span className="text-xs text-electric-blue font-orbitron font-bold">
                            +{quest.xpReward} XP
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: quest.completed ? 1 : 1.05 }}
                        whileTap={{ scale: quest.completed ? 1 : 0.95 }}
                        onClick={() => !quest.completed && completeQuest(quest.id)}
                        disabled={quest.completed}
                        className={`
                          px-6 py-3 rounded-lg font-orbitron font-bold transition-all duration-300
                          ${quest.completed
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white hover:shadow-glow'
                          }
                        `}
                      >
                        {quest.completed ? '✓ Complete' : 'Mark Done'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {allQuestsComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-gradient-to-r from-electric-blue/10 to-green-500/10 
                           border border-electric-blue/40 rounded-lg text-center"
                >
                  <Crown className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                  <h4 className="text-2xl font-orbitron font-bold text-white mb-3 text-glow">
                    🎉 Perfect Day Achievement!
                  </h4>
                  <p className="text-white/80 font-orbitron leading-relaxed">
                    You've completed all 6 daily quests! Your dedication brings you one step closer 
                    to transcending your current rank. Return tomorrow for new challenges.
                  </p>
                </motion.div>
              )}
            </GlowingCard>

            {/* Hunter's Code */}
            <GlowingCard className="mt-6">
              <div className="text-center">
                <Sword className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                  Hunter's Code
                </h3>
                <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-6">
                  <div className="text-white/90 font-orbitron text-sm space-y-2 text-left">
                    <p>⚔️ Complete all 6 core quests daily to maintain your streak</p>
                    <p>📈 Each completed day brings you closer to the next rank</p>
                    <p>⚠️ Missing consecutive days will slow your progress</p>
                    <p>🔥 True hunters never give up, no matter how difficult the path</p>
                  </div>
                </div>
              </div>
            </GlowingCard>

            {/* Discord Community */}
            <GlowingCard className="mt-6">
              <div className="text-center">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                  Join the Hunter Community
                </h3>
                <p className="text-white/80 font-orbitron mb-6 leading-relaxed">
                  Connect with thousands of hunters, share your progress, get motivation, 
                  and participate in exclusive community challenges.
                </p>
                <DiscordButton />
              </div>
            </GlowingCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HunterDashboard;