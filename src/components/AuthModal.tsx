import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Shield, CheckCircle, Check, AlertCircle } from 'lucide-react';
import { signUp, signIn, verifyOTP, resendOTP, validateEmail, getPasswordValidation, validateName } from '../lib/auth';
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
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    otp?: string;
    general?: string;
  }>({});
  const [passwordValidation, setPasswordValidation] = useState(getPasswordValidation(''));

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordValidation(getPasswordValidation(value));
  };

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
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Password must meet all requirements';
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
          // Handle specific error types
          if (result.error.includes('already exists')) {
            setErrors({ email: 'An account with this email already exists' });
          } else if (result.error.includes('weak_password')) {
            setErrors({ password: 'Password must contain uppercase, lowercase, number, and special character' });
          } else {
            setErrors({ general: result.error });
          }
        } else {
          // Check if email confirmation is required
          if (result.user && !result.user.email_confirmed_at) {
            setStep('otp');
          } else {
            // Email confirmation disabled, user is ready
            onSuccess();
            onClose();
            resetForm();
          }
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
    setOtpCode('');
    setErrors({});
    setPasswordValidation(getPasswordValidation(''));
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
                            font-lato text-white placeholder-white/50
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
                        onChange={(e) => handlePasswordChange(e.target.value)}
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
                    
                    {/* Password Validation Checklist */}
                    {mode === 'signup' && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-4 bg-navy-dark/60 border border-electric-blue/20 rounded-lg"
                      >
                        <h4 className="text-white font-orbitron font-medium text-sm mb-3">Password Requirements:</h4>
                        <div className="space-y-2">
                          <ValidationItem
                            isValid={passwordValidation.hasMinLength}
                            text="At least 8 characters"
                          />
                          <ValidationItem
                            isValid={passwordValidation.hasUppercase}
                            text="One uppercase letter (A-Z)"
                          />
                          <ValidationItem
                            isValid={passwordValidation.hasLowercase}
                            text="One lowercase letter (a-z)"
                          />
                          <ValidationItem
                            isValid={passwordValidation.hasNumber}
                            text="One number (0-9)"
                          />
                          <ValidationItem
                            isValid={passwordValidation.hasSpecialChar}
                            text="One special character (!@#$%^&*)"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || (mode === 'signup' && !passwordValidation.isValid)}
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

// Password Validation Item Component
const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <div className={`
        w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
        ${isValid 
          ? 'bg-green-500/20 border border-green-400/50' 
          : 'bg-red-500/20 border border-red-400/50'
        }
      `}>
        {isValid ? (
          <Check className="w-2.5 h-2.5 text-green-400" />
        ) : (
          <AlertCircle className="w-2.5 h-2.5 text-red-400" />
        )}
      </div>
      <span className={`
        font-orbitron text-xs transition-colors duration-300
        ${isValid ? 'text-green-400' : 'text-red-400'}
      `}>
        {text}
      </span>
    </motion.div>
  );
};

export default AuthModal;