import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Shield, CheckCircle } from 'lucide-react';
import { signUp, signIn, verifyOTP, resendOTP, validateEmail, validatePassword, validateName } from '../lib/auth';
import GlowingCard from './GlowingCard';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'signup' | 'login';
  onSwitchMode: (mode: 'signup' | 'login') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  mode, 
  onSwitchMode 
}) => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      } else if (!validateName(name)) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(name.trim(), email, password);
        if (result.error) {
          setErrors({ general: result.error });
        } else {
          // Move to OTP verification step
          setStep('otp');
        }
      } else {
        result = await signIn(email, password);
        if (result.error) {
          setErrors({ general: result.error });
        } else {
          onSuccess();
          onClose();
          resetForm();
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await verifyOTP(email, otpCode);
      if (result.error) {
        setErrors({ otp: result.error });
      } else {
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      setErrors({ otp: error.message || 'Verification failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setErrors({});

    try {
      const result = await resendOTP(email);
      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setErrors({ general: 'Verification code sent! Check your email.' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to resend code' });
    } finally {
      setIsResending(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setErrors({});
  };

  const handleSwitchMode = (newMode: 'signup' | 'login') => {
    resetForm();
    onSwitchMode(newMode);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <GlowingCard className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {step === 'form' ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-electric-blue" />
                  </div>
                  <h2 className="text-3xl font-orbitron font-bold text-white mb-2 text-glow-strong">
                    {mode === 'signup' ? 'Join the Hunter System' : 'Hunter Login'}
                  </h2>
                  <p className="text-white/80 font-orbitron">
                    {mode === 'signup' 
                      ? 'Create your hunter profile to begin your journey'
                      : 'Welcome back, Hunter. Access your system.'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        errors.general.includes('sent') 
                          ? 'bg-green-500/10 border border-green-400/30' 
                          : 'bg-red-500/10 border border-red-400/30'
                      }`}
                    >
                      <p className={`font-orbitron text-sm ${
                        errors.general.includes('sent') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {errors.general}
                      </p>
                    </motion.div>
                  )}

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-white font-orbitron font-medium mb-2">
                        Hunter Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`
                            w-full pl-10 pr-4 py-3 bg-navy-dark/80 border rounded-lg
                            font-orbitron text-white placeholder-white/50
                            focus:outline-none focus:ring-2 focus:ring-electric-blue/50
                            transition-all duration-300
                            ${errors.name 
                              ? 'border-red-400/50 focus:border-red-400' 
                              : 'border-electric-blue/30 focus:border-electric-blue'
                            }
                          `}
                          placeholder="Enter your hunter name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-400 font-orbitron text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-white font-orbitron font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`
                          w-full pl-10 pr-4 py-3 bg-navy-dark/80 border rounded-lg
                          font-orbitron text-white placeholder-white/50
                          focus:outline-none focus:ring-2 focus:ring-electric-blue/50
                          transition-all duration-300
                          ${errors.email 
                            ? 'border-red-400/50 focus:border-red-400' 
                            : 'border-electric-blue/30 focus:border-electric-blue'
                          }
                        `}
                        placeholder="hunter@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 font-orbitron text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-orbitron font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`
                          w-full pl-10 pr-4 py-3 bg-navy-dark/80 border rounded-lg
                          font-orbitron text-white placeholder-white/50
                          focus:outline-none focus:ring-2 focus:ring-electric-blue/50
                          transition-all duration-300
                          ${errors.password 
                            ? 'border-red-400/50 focus:border-red-400' 
                            : 'border-electric-blue/30 focus:border-electric-blue'
                          }
                        `}
                        placeholder="Enter your password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-400 font-orbitron text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-white font-orbitron font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`
                            w-full pl-10 pr-4 py-3 bg-navy-dark/80 border rounded-lg
                            font-orbitron text-white placeholder-white/50
                            focus:outline-none focus:ring-2 focus:ring-electric-blue/50
                            transition-all duration-300
                            ${errors.confirmPassword 
                              ? 'border-red-400/50 focus:border-red-400' 
                              : 'border-electric-blue/30 focus:border-electric-blue'
                            }
                          `}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 font-orbitron text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                             text-white font-orbitron font-bold text-lg rounded-lg
                             shadow-glow-strong hover:shadow-electric-blue/25 
                             border border-electric-blue/50 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          {mode === 'signup' ? 'Create Hunter Profile' : 'Access Hunter System'}
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white/60 font-orbitron text-sm mb-3">
                    {mode === 'signup' ? 'Already have an account?' : 'New to the Hunter System?'}
                  </p>
                  <button
                    onClick={() => handleSwitchMode(mode === 'signup' ? 'login' : 'signup')}
                    className="text-electric-blue font-orbitron font-semibold hover:text-white transition-colors text-glow"
                  >
                    {mode === 'signup' ? 'Sign In Instead' : 'Create Account'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-electric-blue" />
                  </div>
                  <h2 className="text-3xl font-orbitron font-bold text-white mb-2 text-glow-strong">
                    Verify Your Email
                  </h2>
                  <p className="text-white/80 font-orbitron mb-4">
                    We've sent a 6-digit verification code to:
                  </p>
                  <p className="text-electric-blue font-orbitron font-semibold text-glow">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleOTPVerification} className="space-y-4">
                  {errors.otp && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
                    >
                      <p className="text-red-400 font-orbitron text-sm">{errors.otp}</p>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-white font-orbitron font-medium mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`
                          w-full pl-10 pr-4 py-3 bg-navy-dark/80 border rounded-lg
                          font-orbitron text-white placeholder-white/50 text-center text-2xl tracking-widest
                          focus:outline-none focus:ring-2 focus:ring-electric-blue/50
                          transition-all duration-300
                          ${errors.otp 
                            ? 'border-red-400/50 focus:border-red-400' 
                            : 'border-electric-blue/30 focus:border-electric-blue'
                          }
                        `}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                             text-white font-orbitron font-bold text-lg rounded-lg
                             shadow-glow-strong hover:shadow-electric-blue/25 
                             border border-electric-blue/50 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Verify & Activate Account
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white/60 font-orbitron text-sm mb-3">
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-electric-blue font-orbitron font-semibold hover:text-white transition-colors text-glow disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setStep('form')}
                    className="text-white/60 font-orbitron text-sm hover:text-white transition-colors"
                  >
                    ← Back to form
                  </button>
                </div>
              </>
            )}
          </GlowingCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;