import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Calendar, CheckSquare, Sparkles } from 'lucide-react';

export const OnboardingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-4xl bg-white sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col sm:flex-row">
        {/* Left Side (or Top on Mobile) - Branded Wave Illustration Card matching Figma */}
        <div className="relative sm:w-1/2 min-h-[46vh] sm:min-h-[560px] bg-gradient-to-b from-[#3B66FF] to-[#2D55FB] flex flex-col items-center justify-center p-8 overflow-hidden flex-shrink-0">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-6 -left-12 w-40 h-40 rounded-full bg-white/10 blur-lg pointer-events-none" />

          {/* Figma Wavy Graphic SVG */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-6">
            <div className="opacity-40">
              <svg width="140" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20L15 10L30 20L45 10L60 20L75 10L90 20L105 10L120 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 30L15 20L30 30L45 20L60 30L75 20L90 30L105 20L120 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Central Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl shadow-blue-950/20"
            >
              <CheckCircle2 className="w-12 h-12 text-white stroke-[2.2]" />
            </motion.div>

            <div className="opacity-40">
              <svg width="140" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20L15 10L30 20L45 10L60 20L75 10L90 20L105 10L120 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 30L15 20L30 30L45 20L60 30L75 20L90 30L105 20L120 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side (or Bottom on Mobile) - Content */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wide uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Task Management System
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Manage What To Do
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-2">
                The best way to manage what you have to do, don't forget your plans.
              </p>
            </div>

            {/* Desktop feature bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Optimistic UI & Swipe Actions
                  </h4>
                  <p className="text-xs text-slate-400">
                    Instant toggling with swipe-to-delete gestures on mobile & desktop.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Weekly Calendar Breakdowns
                  </h4>
                  <p className="text-xs text-slate-400">
                    Monday-Sunday MongoDB aggregations with live progress gauges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
