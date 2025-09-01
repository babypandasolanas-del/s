import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StatCard {
  id: string;
  name: string;
  emoji: string;
}

interface StatsCarouselProps {
  className?: string;
}

const statsData: StatCard[] = [
  { id: 'mind', name: 'Mind', emoji: '🧠' },
  { id: 'body', name: 'Body', emoji: '💪' },
  { id: 'discipline', name: 'Discipline', emoji: '⏳' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '🏡' },
  { id: 'willpower', name: 'Willpower', emoji: '🔥' },
  { id: 'focus', name: 'Focus', emoji: '🎯' }
];

const StatsCarousel: React.FC<StatsCarouselProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive cards per slide
  useEffect(() => {
    const updateCardsPerSlide = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCardsPerSlide(1);
      } else if (width <= 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  const totalSlides = Math.ceil(statsData.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      prevSlide();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isDragging, totalSlides]);

  const getCurrentSlideCards = () => {
    const startIndex = currentIndex * cardsPerSlide;
    return statsData.slice(startIndex, startIndex + cardsPerSlide);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Core stats carousel"
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`flex gap-6 w-full ${
                cardsPerSlide === 1 ? 'justify-center' : 
                cardsPerSlide === 2 ? 'justify-center' : 
                'justify-center'
              }`}
            >
              {getCurrentSlideCards().map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className={`
                    relative backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer
                    transition-all duration-300 group
                    ${cardsPerSlide === 1 ? 'w-80 max-w-sm' : 
                      cardsPerSlide === 2 ? 'w-72' : 
                      'w-64'
                    }
                  `}
                  style={{
                    backgroundColor: 'rgba(10, 15, 28, 0.8)',
                    border: '2px solid rgba(0, 240, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 240, 255, 0.1)',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.8)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 240, 255, 0.1)';
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stat.name} stat card`}
                >
                  {/* Animated Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 70%)'
                    }}
                  />
                  
                  {/* Rotating Border Animation */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(0, 240, 255, 0.4), transparent)',
                      opacity: 0
                    }}
                    whileHover={{
                      opacity: [0, 0.3, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative z-10">
                    {/* Emoji with Pulse Animation */}
                    <motion.div
                      className="text-6xl mb-4"
                      whileHover={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                    >
                      {stat.emoji}
                    </motion.div>
                    
                    {/* Stat Name */}
                    <h3 
                      className="font-orbitron font-bold text-xl transition-all duration-300"
                      style={{
                        color: '#00F0FF',
                        textShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
                      }}
                    >
                      {stat.name}
                    </h3>
                  </div>

                  {/* Corner Accent */}
                  <div 
                    className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: '#00F0FF' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <div className="hidden md:block">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full
                   bg-navy-dark/80 border border-electric-blue/30 hover:border-electric-blue/60
                   text-electric-blue hover:text-white transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}
          aria-label="Previous stats"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full
                   bg-navy-dark/80 border border-electric-blue/30 hover:border-electric-blue/60
                   text-electric-blue hover:text-white transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}
          aria-label="Next stats"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => goToSlide(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${currentIndex === index 
                ? 'bg-electric-blue shadow-glow' 
                : 'bg-electric-blue/30 hover:bg-electric-blue/60'
              }
            `}
            style={{
              boxShadow: currentIndex === index 
                ? '0 0 15px rgba(0, 240, 255, 0.6)' 
                : 'none'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Indicator for Mobile */}
      <div className="md:hidden text-center mt-4">
        <p className="text-electric-blue/60 font-orbitron text-sm">
          ← Swipe to explore stats →
        </p>
      </div>
    </div>
  );
};

export default StatsCarousel;