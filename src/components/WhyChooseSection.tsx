import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const WhyChooseSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      title: "Transform Chaos into Progress",
      description: "Turn procrastination and distractions into daily wins. Build laser focus and unstoppable momentum."
    },
    {
      title: "Gamify Your Growth",
      description: "No boring habit trackers. Every action you take boosts your stats, unlocks quests, and ranks you up."
    },
    {
      title: "Discipline That Actually Sticks",
      description: "Our AI mentor guides you step-by-step, so discipline becomes natural — not forced."
    },
    {
      title: "Progress You Can Feel",
      description: "See your strength, focus, and consistency increase in real time. Your life stops feeling random — it starts feeling leveled."
    },
    {
      title: "A Hunter Community",
      description: "You're not alone. Thousands of other hunters are grinding, sharing wins, and helping each other push to the next rank."
    },
    {
      title: "No Overwhelm, Just Action",
      description: "Forget complicated plans. We give you the exact next step every day — so all you need to do is act."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#0A0F1C' }}>
      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-30"
            style={{
              backgroundColor: '#00F0FF',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-lato font-bold text-white mb-6 tracking-tight">
              Why Choose SelfLeveling?
          </h2>
          
          <p className="text-base text-gray-300 font-lato mb-8 max-w-2xl mx-auto">
            Stop struggling alone. Start leveling up like a Hunter.
          </p>
          
          {/* Glowing Separator Line */}
          <motion.div
            className="w-32 h-1 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(to right, transparent, #00F0FF, transparent)',
              boxShadow: '0 0 20px #00F0FF, 0 0 40px #00F0FF, 0 0 60px #00F0FF'
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div 
                className="relative backdrop-blur-sm rounded-2xl p-8 h-full transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(10, 15, 28, 0.8)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                {/* Card Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.1)'
                  }}
                />
                
                {/* Animated Border Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(45deg, transparent, rgba(0, 240, 255, 0.3), transparent)',
                    opacity: 0
                  }}
                  whileHover={{
                    opacity: [0, 0.5, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="relative z-10">
                  <h3 
                    className="text-xl md:text-2xl font-lato font-bold text-white mb-4 transition-colors duration-300 tracking-tight"
                    style={{
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#00F0FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p 
                    className="text-gray-300 font-lato text-base leading-relaxed transition-colors duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgb(209, 213, 219)';
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>

                {/* Corner Accent */}
                <div 
                  className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#00F0FF' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Glow Effect */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
        />
      </div>
    </section>
  );
};

export default WhyChooseSection;