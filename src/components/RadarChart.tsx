import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  stats: {
    mind: number;
    body: number;
    discipline: number;
    lifestyle: number;
    willpower: number;
    focus: number;
  };
  maxValue?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ stats, maxValue = 100 }) => {
  const categories = [
    { key: 'mind', label: 'Mind', color: '#00f0ff' },
    { key: 'body', label: 'Body', color: '#ff6b35' },
    { key: 'discipline', label: 'Discipline', color: '#a855f7' },
    { key: 'lifestyle', label: 'Lifestyle', color: '#10b981' },
    { key: 'willpower', label: 'Willpower', color: '#f59e0b' },
    { key: 'focus', label: 'Focus', color: '#ec4899' }
  ];

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const levels = 5;

  const points = useMemo(() => {
    return categories.map((cat, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      const value = stats[cat.key as keyof typeof stats] || 0;
      const radius = (value / maxValue) * maxRadius;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        labelX: centerX + Math.cos(angle) * (maxRadius + 30),
        labelY: centerY + Math.sin(angle) * (maxRadius + 30),
        value,
        ...cat
      };
    });
  }, [stats, maxValue]);

  const pathData = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="300" height="300" className="overflow-visible">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid circles */}
        {Array.from({ length: levels }).map((_, i) => {
          const radius = ((i + 1) / levels) * maxRadius;
          return (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#00f0ff"
              strokeOpacity={0.1 + (i * 0.05)}
              strokeWidth="1"
            />
          );
        })}

        {/* Grid lines from center */}
        {categories.map((cat, i) => {
          const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
          const endX = centerX + Math.cos(angle) * maxRadius;
          const endY = centerY + Math.sin(angle) * maxRadius;

          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="#00f0ff"
              strokeOpacity="0.15"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon with animation */}
        <motion.path
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d={pathData}
          fill="url(#radarGlow)"
          stroke="#00f0ff"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={point.color}
              stroke="#0d0d1a"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#ffffff"
            />
          </motion.g>
        ))}

        {/* Labels */}
        {points.map((point, i) => (
          <g key={i}>
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-orbitron text-xs font-bold"
              fill="#00f0ff"
              style={{ textShadow: '0 0 10px #00f0ff' }}
            >
              {point.label}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-orbitron text-xs"
              fill="#ffffff"
              fillOpacity="0.7"
            >
              {point.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;
