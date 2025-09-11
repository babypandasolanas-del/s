import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, Trophy, UserPlus, LogIn, Crown } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import WhyChooseSection from '../components/WhyChooseSection';
import StatsCarousel from '../components/StatsCarousel';
import Footer from '../components/Footer';
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
      {/* Fixed Header with Auth Buttons */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 p-4 md:px-4 md:py-4 px-3 py-1.5"
      >
        <div className="flex justify-end">
          {!isAuthenticated ? (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0, 240, 255, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUp}
                className="px-6 py-3 bg-electric-blue text-black font-orbitron font-bold 
                         rounded-2xl shadow-lg hover:shadow-electric-blue/25 
                         transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </div>
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#00F0FF",
                  color: "#000000"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="px-6 py-3 bg-transparent border-2 border-electric-blue 
                         text-electric-blue font-orbitron font-bold rounded-2xl 
                         shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Log In
                </div>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-2 bg-navy-dark/80 
                       border border-electric-blue/30 rounded-2xl backdrop-blur-sm"
            >
              <Crown className="w-5 h-5 text-electric-blue" />
              <span className="text-white font-orbitron font-medium">
                Hunter {userName}
              </span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-xl font-lato mb-12 max-w-3xl mx-auto leading-relaxed"
            className="text-3xl md:text-5xl font-lato font-bold mb-8 text-white tracking-tight"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-orbitron font-bold mb-8 text-white"
              style={{
                textShadow: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)'
              }}
            >
              Awaken Your Hunter System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl font-orbitron mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#9BE8FF' }}
            >
              Transform your life into an RPG adventure. Complete daily quests, level up your stats, 
              and become the main character of your own story.
            </motion.p>
            
            {isAuthenticated && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="text-lg md:text-xl font-orbitron mb-8"
                style={{ color: '#9BE8FF' }}
              >
                Welcome back, Hunter {userName}. Ready for your assessment?
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartTest}
              className="px-8 py-4 text-black font-orbitron font-bold text-xl rounded-2xl
                       shadow-lg transition-all duration-300"
              style={{
                backgroundColor: '#00F0FF',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
              }}
            >
              Take Your Assessment
            </motion.button>
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

      {/* Why Choose SelfLeveling Section */}
      <WhyChooseSection />

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-orbitron font-bold text-white mb-12 text-glow"
        >
          Master Six Core Stats
        </motion.h2>
        <StatsCarousel />
      </div>

      <Footer />

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
      <h3 className="text-xl font-lato font-bold text-white mb-3 text-glow tracking-tight">{title}</h3>
      <p className="text-white/80 font-lato leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default LandingPage;