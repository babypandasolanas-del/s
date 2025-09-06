import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import GlowingCard from '../components/GlowingCard';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
            <FileText className="w-8 h-8 text-electric-blue" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Terms of Service
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Agreement for using the SelfLeveling Hunter System
          </p>
        </motion.div>

        <GlowingCard>
          <div className="space-y-6 text-white font-orbitron">
            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Acceptance of Terms
              </h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using SelfLeveling, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Use License
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Permission is granted to temporarily access SelfLeveling for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="text-white/80 leading-relaxed">
                Under this license you may not:
              </p>
              <ul className="text-white/80 leading-relaxed space-y-2 mt-2">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                User Accounts
              </h2>
              <p className="text-white/80 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Hunter Code of Conduct
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                As a member of the Hunter System, you agree to:
              </p>
              <ul className="text-white/80 leading-relaxed space-y-2">
                <li>• Complete quests honestly and track progress accurately</li>
                <li>• Respect other hunters in guild interactions</li>
                <li>• Not attempt to manipulate or exploit the ranking system</li>
                <li>• Use the platform for personal development and growth</li>
                <li>• Report any bugs or issues to help improve the system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Service Availability
              </h2>
              <p className="text-white/80 leading-relaxed">
                We strive to provide continuous service availability, but we do not guarantee 
                uninterrupted access. The service may be temporarily unavailable for maintenance, 
                updates, or due to circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Limitation of Liability
              </h2>
              <p className="text-white/80 leading-relaxed">
                In no event shall SelfLeveling or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-electric-blue mb-4 text-glow">
                Modifications
              </h2>
              <p className="text-white/80 leading-relaxed">
                SelfLeveling may revise these terms of service at any time without notice. 
                By using this service, you are agreeing to be bound by the then current version 
                of these terms of service.
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

export default TermsOfService;