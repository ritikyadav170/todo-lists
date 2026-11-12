import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const OnboardingPage = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white overflow-hidden shadow-2xl sm:my-6 sm:rounded-3xl border border-slate-100">
      {/* Top Banner / Illustration Card (Matching Figma Screen 1) */}
      <div className="relative h-[56vh] bg-gradient-to-b from-[#3B66FF] to-[#2D55FB] flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Decorative subtle circles in top corners */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute top-1/3 -left-12 w-36 h-36 rounded-full bg-white/5 blur-lg pointer-events-none" />

        {/* Decorative Zigzag / Wavy graphics matching Figma */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-6">
          {/* Top wavy lines */}
          <div className="opacity-40">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20L15 10L30 20L45 10L60 20L75 10L90 20L105 10L120 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 30L15 20L30 30L45 20L60 30L75 20L90 30L105 20L120 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Central app preview icon or card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-blue-900/20"
          >
            <CheckCircle2 className="w-12 h-12 text-white stroke-[2.2]" />
          </motion.div>

          {/* Bottom wavy lines */}
          <div className="opacity-40">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20L15 10L30 20L45 10L60 20L75 10L90 20L105 10L120 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 30L15 20L30 30L45 20L60 30L75 20L90 30L105 20L120 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Content (Matching Figma Screen 1) */}
      <div className="flex-1 flex flex-col justify-between p-8 bg-white">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Manage What To Do
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8"
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;

