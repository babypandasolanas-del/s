import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, Trophy, UserPlus, LogIn } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';

interface LandingPageProps {
  onStartTest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartTest }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const { isAuthenticated, userName } = useAuth();

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // If user is now authenticated, start the test
    if (isAuthenticated) {
      onStartTest();
    }
  };

  const handleStartTest = () => {
    if (isAuthenticated) {
      onStartTest();
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-orbitron font-black mb-8 text-glow-strong"
              style={{
                background: 'linear-gradient(45deg, #00CFFF, #FFFFFF, #00CFFF)',
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 50px rgba(0, 207, 255, 0.6)',
                animation: 'gradient 3s ease infinite'
              }}
            >
              Awaken Your
              <br />
              Hunter System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl font-orbitron text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed text-glow"
            >
              Transform your life into an RPG adventure. Complete daily quests, level up your stats, 
              and become the main character of your own story.
            </motion.p>
            
            {isAuthenticated && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl font-orbitron text-electric-blue mb-8 text-glow"
              >
                Welcome Hunter {userName}, take our assessment
              </motion.p>
            )}

            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-xl p-8 max-w-md mx-auto mb-8">
                  <Shield className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold text-white mb-3 text-glow">
                    Sign up / Log in to begin your assessment
                  </h3>
                  <p className="text-white/80 font-orbitron text-sm">
                    Create your hunter profile to access the awakening test and daily quest system.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignUp}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                             text-white font-orbitron font-bold text-lg rounded-xl
                             shadow-glow-strong hover:shadow-electric-blue/25 
                             border border-electric-blue/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <UserPlus className="w-5 h-5" />
                      Sign Up
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignIn}
                    className="flex-1 px-6 py-4 bg-navy-dark/80 hover:bg-navy-dark 
                             text-white font-orbitron font-bold text-lg rounded-xl
                             border border-electric-blue/50 hover:border-electric-blue
                             transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <LogIn className="w-5 h-5" />
                      Log In
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTest}
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                         text-white font-orbitron font-bold text-xl rounded-xl
                         shadow-glow-strong hover:shadow-electric-blue/25 
                         border border-electric-blue/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Begin Hunter Assessment
                </div>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Rank System"
            description="Progress from E-Rank to SS-Rank Hunter through consistent daily quests and challenges."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Guild System"
            description="Join specialized guilds and compete with other hunters on global leaderboards."
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Boss Missions"
            description="Face epic challenges to advance your rank and unlock new abilities."
          />
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-orbitron font-bold text-white mb-12 text-glow">Master Six Core Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {['Mind', 'Body', 'Discipline', 'Lifestyle', 'Willpower', 'Focus'].map((stat) => (
            <motion.div
              key={stat}
              whileHover={{ scale: 1.05 }}
              className="bg-navy-dark/50 border border-electric-blue/30 rounded-lg p-6
                         backdrop-blur-sm hover:border-electric-blue/60 transition-all duration-300"
            >
              <h3 className="text-electric-blue font-orbitron font-bold text-lg text-glow">{stat}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-navy-dark/90 to-slate-900/90
                 border border-electric-blue/30 rounded-xl p-6
                 backdrop-blur-sm hover:border-electric-blue/60 transition-all duration-300"
      style={{
        boxShadow: '0 0 20px rgba(0, 207, 255, 0.15)'
      }}
    >
      <div className="text-electric-blue mb-4">{icon}</div>
      <h3 className="text-xl font-orbitron font-bold text-white mb-3 text-glow">{title}</h3>
      <p className="text-white/80 font-orbitron leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default LandingPage;