import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlowingCard from '../components/GlowingCard';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    const mailtoLink = 'mailto:selflevelings@gmail.com?subject=Support Request – SelfLeveling';
    window.location.href = mailtoLink;
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#0A0F1C' }}>
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            className="mb-6"
          >
            <div className="inline-block p-8 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full border-4 border-electric-blue shadow-glow-strong">
              <Mail className="w-16 h-16 text-electric-blue" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Contact Us
          </h1>
          
          <p className="text-xl text-white/90 font-orbitron mb-8 text-glow">
            Have questions or need support? Reach out anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <GlowingCard className="mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-glow">
                Get in Touch
              </h2>
              
              <p className="text-white/80 font-orbitron mb-8 leading-relaxed">
                Whether you need help with your hunter journey, have technical questions, 
                or want to share feedback, our team is here to help you level up.
              </p>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 207, 255, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmailClick}
                className="w-full max-w-sm px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                         text-white font-orbitron font-bold text-lg rounded-xl
                         shadow-glow-strong hover:shadow-electric-blue/25 
                         border border-electric-blue/50 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(0, 207, 255, 0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-6 h-6" />
                  Email Us
                </div>
              </motion.button>

              <div className="mt-6 text-center">
                <p className="text-white/60 font-orbitron text-sm">
                  📧 selflevelings@gmail.com
                </p>
                <p className="text-white/60 font-orbitron text-xs mt-2">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </GlowingCard>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              className="text-white/60 font-orbitron text-sm hover:text-white transition-colors
                       flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;