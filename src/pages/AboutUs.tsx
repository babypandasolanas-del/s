import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Crown } from 'lucide-react';
import GlowingCard from '../components/GlowingCard';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
            <Crown className="w-8 h-8 text-electric-blue" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            About Us
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Transforming lives through the power of gamification
          </p>
        </motion.div>

        <div className="space-y-8">
          <GlowingCard>
            <div className="text-center">
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-glow">
                Our Mission
              </h2>
              <p className="text-white/80 font-orbitron text-lg leading-relaxed mb-6">
                SelfLeveling exists to help individuals break free from mediocrity and unlock their true potential. 
                We believe that everyone has an inner hunter waiting to be awakened - someone capable of extraordinary 
                discipline, focus, and achievement.
              </p>
              <p className="text-white/80 font-orbitron leading-relaxed">
                By gamifying personal development, we transform the often overwhelming journey of self-improvement 
                into an engaging, measurable, and rewarding adventure. Every quest completed, every streak maintained, 
                and every rank achieved brings you closer to becoming the person you were meant to be.
              </p>
            </div>
          </GlowingCard>

          <div className="grid md:grid-cols-3 gap-6">
            <GlowingCard>
              <div className="text-center">
                <Target className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 text-glow">
                  Purpose-Driven
                </h3>
                <p className="text-white/80 font-orbitron text-sm leading-relaxed">
                  We help you identify and pursue meaningful goals that align with your values and aspirations.
                </p>
              </div>
            </GlowingCard>

            <GlowingCard>
              <div className="text-center">
                <Zap className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 text-glow">
                  Action-Oriented
                </h3>
                <p className="text-white/80 font-orbitron text-sm leading-relaxed">
                  No more endless planning. We provide clear, actionable daily quests that drive real progress.
                </p>
              </div>
            </GlowingCard>

            <GlowingCard>
              <div className="text-center">
                <Users className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 text-glow">
                  Community-Powered
                </h3>
                <p className="text-white/80 font-orbitron text-sm leading-relaxed">
                  Join thousands of hunters supporting each other on the journey to greatness.
                </p>
              </div>
            </GlowingCard>
          </div>

          <GlowingCard>
            <div className="text-center">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-glow">
                The Hunter Philosophy
              </h2>
              <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-6">
                <blockquote className="text-white/90 font-orbitron text-lg leading-relaxed italic">
                  "A hunter is not defined by where they start, but by their unwavering commitment to growth. 
                  Every day is an opportunity to level up, every challenge is a quest to overcome, 
                  and every setback is training for the next breakthrough."
                </blockquote>
              </div>
            </div>
          </GlowingCard>

          <GlowingCard>
            <div className="text-center">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                Why We Built This
              </h2>
              <p className="text-white/80 font-orbitron leading-relaxed mb-4">
                Traditional self-help approaches often fail because they lack structure, accountability, and immediate feedback. 
                We've experienced the frustration of setting goals only to abandon them weeks later.
              </p>
              <p className="text-white/80 font-orbitron leading-relaxed mb-4">
                SelfLeveling was born from the realization that humans are naturally motivated by progress, achievement, 
                and competition. By applying game mechanics to real-life improvement, we've created a system that makes 
                discipline feel natural and growth feel inevitable.
              </p>
              <p className="text-electric-blue font-orbitron font-semibold text-glow">
                Your journey to becoming an SS-Rank Hunter starts today.
              </p>
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;