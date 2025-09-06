import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import GlowingCard from '../components/GlowingCard';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-electric-blue" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Privacy Policy
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Your privacy and data protection are our top priorities
          </p>
        </motion.div>

        <GlowingCard>
          <div className="space-y-6 text-white font-orbitron">
            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Information We Collect
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                complete your hunter assessment, or contact us for support. This may include your name, 
                email address, and assessment responses.
              </p>
              <p className="text-white/80 leading-relaxed">
                We also automatically collect certain information about your device and usage patterns 
                to improve our services and provide personalized quest recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                How We Use Your Information
              </h2>
              <ul className="text-white/80 leading-relaxed space-y-2">
                <li>• Provide and maintain your hunter profile and progress tracking</li>
                <li>• Generate personalized daily quests based on your rank and goals</li>
                <li>• Send you notifications about quest reminders and achievements</li>
                <li>• Analyze usage patterns to improve our platform and user experience</li>
                <li>• Communicate with you about updates, security alerts, and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Data Security
              </h2>
              <p className="text-white/80 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or 
                destruction. Your data is encrypted in transit and at rest using industry-standard protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Your Rights
              </h2>
              <p className="text-white/80 leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You can also opt out of certain communications and data processing activities. 
                Contact us if you wish to exercise any of these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Contact Us
              </h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at privacy@selfleveling.com.
              </p>
            </section>

            <div className="text-center pt-6 border-t border-electric-blue/30">
              <p className="text-electric-blue/60 text-sm">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </GlowingCard>
      </div>
    </div>
  );
};

export default PrivacyPolicy;