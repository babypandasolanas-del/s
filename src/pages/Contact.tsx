import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import GlowingCard from '../components/GlowingCard';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
            <Mail className="w-8 h-8 text-electric-blue" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Contact
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Get in touch with the SelfLeveling team
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <GlowingCard>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-glow">
              Send us a Message
            </h2>
            
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full mb-4">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2 text-glow">
                  Message Sent!
                </h3>
                <p className="text-white/80 font-orbitron">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-electric-blue font-orbitron font-semibold hover:text-white transition-colors text-glow"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-orbitron font-medium mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-navy-dark/80 border border-electric-blue/30 
                               rounded-lg font-orbitron text-white placeholder-white/50
                               focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue
                               transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-orbitron font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-navy-dark/80 border border-electric-blue/30 
                               rounded-lg font-orbitron text-white placeholder-white/50
                               focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue
                               transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-orbitron font-medium mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-electric-blue" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 bg-navy-dark/80 border border-electric-blue/30 
                               rounded-lg font-orbitron text-white placeholder-white/50 resize-none
                               focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue
                               transition-all duration-300"
                      placeholder="Tell us how we can help you on your hunter journey..."
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                           text-white font-orbitron font-bold text-lg rounded-lg
                           shadow-glow-strong hover:shadow-electric-blue/25 
                           border border-electric-blue/50 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </div>
                </motion.button>
              </form>
            )}
          </GlowingCard>

          {/* Contact Information */}
          <div className="space-y-6">
            <GlowingCard>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                Get Support
              </h3>
              <div className="space-y-4 text-white/80 font-orbitron">
                <p className="leading-relaxed">
                  Need help with your hunter journey? Have questions about quests, rankings, or technical issues? 
                  We're here to help you level up.
                </p>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-electric-blue" />
                  <span>support@selfleveling.com</span>
                </div>
              </div>
            </GlowingCard>

            <GlowingCard>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                Business Inquiries
              </h3>
              <div className="space-y-4 text-white/80 font-orbitron">
                <p className="leading-relaxed">
                  Interested in partnerships, collaborations, or enterprise solutions? 
                  Let's discuss how we can work together.
                </p>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-electric-blue" />
                  <span>business@selfleveling.com</span>
                </div>
              </div>
            </GlowingCard>

            <GlowingCard>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4 text-glow">
                Response Time
              </h3>
              <div className="text-white/80 font-orbitron">
                <p className="leading-relaxed mb-3">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
                <p className="text-electric-blue font-semibold text-glow">
                  Your success is our priority.
                </p>
              </div>
            </GlowingCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;