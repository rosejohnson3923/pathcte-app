import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';
import { MobileMenu, MobileMenuButton } from '../components/common';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-teal-500 to-purple-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/pathCTE_wNoText_Light.svg"
              alt="PathCTE"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
              PathCTE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
            <Link
              to="/login"
              className="px-3 md:px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-medium text-sm md:text-base"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 md:px-6 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg shadow-lg font-semibold transition-all hover:scale-105 text-sm md:text-base"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <MobileMenuButton
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:bg-white/10"
            />
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="flex flex-col space-y-4">
          <Link
            to="/login"
            className="block px-4 py-3 text-center text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-3 text-center bg-purple-600 text-white hover:bg-purple-700 rounded-lg shadow-lg font-semibold transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign Up Free
          </Link>
        </div>
      </MobileMenu>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-white/30">
                ✨ 100% FREE for Students & Teachers
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-2 sm:mb-3 leading-tight px-4">
              AI Career Exploration
              <br />
              Made <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Fun</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-4 sm:mb-6 font-medium">
              PathCTE (pronounced <span className="font-bold text-white">"Path-SET"</span>)
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 font-medium max-w-3xl mx-auto leading-relaxed px-4 mb-6">
              The FREE AI-powered platform delivering personalized and gamified learning for Career & Technical Education
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 px-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white text-xs sm:text-sm font-semibold">🤖 Powered by Azure AI Foundry</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white text-xs sm:text-sm font-semibold">🛡️ Protected by Azure AI Content Safety</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-purple-600 hover:bg-gray-50 rounded-xl shadow-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:shadow-purple-500/50 text-center"
            >
              Get Started Free →
            </Link>
          </div>

          {/* How to Play */}
          <div className="mb-12 sm:mb-16 px-2">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-white/30">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
                How to Play
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {/* Step 1 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-white/20">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Step 1</h3>
                  <p className="text-white/90 font-medium text-sm sm:text-base">
                    Select Career, Industry, or CTE Cluster
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-white/20">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎮</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Step 2</h3>
                  <p className="text-white/90 font-medium text-sm sm:text-base">
                    Join Solo Game or Tournament Play
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-white/20">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Step 3</h3>
                  <p className="text-white/90 font-medium text-sm sm:text-base">
                    Earn XP Points & Pathkey Awards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
            {/* For Students */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">For Students</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                <ValuePoint text="Play fun games with your classmates" />
                <ValuePoint text="Discover careers you never knew existed" />
                <ValuePoint text="Collect rare career Pathkeys" />
                <ValuePoint text="Compete on leaderboards" />
              </ul>
            </div>

            {/* For Teachers/Parents */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">For Teachers/Parents</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                <ValuePoint text="Engage students with gamified CTE" />
                <ValuePoint text="Track student career exploration" />
                <ValuePoint text="Ready-to-use question sets" />
                <ValuePoint text="Real-time analytics dashboard" />
              </ul>
            </div>
          </div>

          {/* How It Works - PathCTE → Pathfinity */}
          <div id="how-it-works" className="mb-12 sm:mb-16 px-2">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
                Your Gateway to Career-First Learning
              </h2>
              <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto px-4">
                PathCTE is the fun introduction to a revolutionary educational approach
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-white/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                {/* PathCTE Side */}
                <div className="bg-gradient-to-br from-teal-600/60 to-teal-500/60 backdrop-blur-md rounded-xl p-5 sm:p-6 border-2 border-teal-300/60 shadow-xl">
                  <div className="inline-block bg-gradient-to-r from-teal-500 to-teal-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-white/40 shadow-lg">
                    <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">START HERE: PathCTE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">Discover Your Future</h3>
                  <ul className="space-y-2 sm:space-y-3 text-white text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg">Play career exploration games</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg">Collect career Pathkeys</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg">Discover what excites you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg">100% free, always</span>
                    </li>
                  </ul>
                </div>

                {/* Arrow & Pathfinity Side */}
                <div className="bg-gradient-to-br from-purple-600/60 to-purple-500/60 backdrop-blur-md rounded-xl p-5 sm:p-6 border-2 border-purple-300/60 shadow-xl">
                  <div className="text-center mb-4 sm:mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/40 shadow-lg mb-2">
                      <div className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">→</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-white/40">
                      <span className="text-white text-xs sm:text-sm font-bold drop-shadow-lg">Then unlock</span>
                    </div>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-purple-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-white/40 shadow-lg">
                    <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">LEVEL UP: Pathfinity.ai</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">Transform Your Education</h3>
                  <ul className="space-y-2 sm:space-y-3 text-white text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg"><strong>BE a professional</strong> every day (K-12)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg"><strong>PathIQ AI</strong> personalizes your learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg"><strong>6 Finn AI agents</strong> guide you 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                      <span className="font-semibold drop-shadow-lg">Full Career-First education revolution</span>
                    </li>
                  </ul>
                  <a
                    href="https://pathfinity.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base w-full sm:w-auto text-center"
                  >
                    Learn About Pathfinity.ai →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Simple Stats */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/30 mx-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,000+</div>
                <div className="text-sm sm:text-base text-white/80 font-medium">Career Pathways</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">20+</div>
                <div className="text-sm sm:text-base text-white/80 font-medium">Game Modes</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm sm:text-base text-white/80 font-medium">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 sm:py-12 text-white/80">
        <div className="max-w-5xl mx-auto">
          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* PathCTE */}
            <div className="text-center">
              <h3 className="font-bold text-white mb-3 text-sm sm:text-base">PathCTE</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Pathfinity Family */}
            <div className="text-center">
              <h3 className="font-bold text-white mb-3 text-sm sm:text-base">Pathfinity Family</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Pathfinity.ai →
                  </a>
                </li>
                <li>
                  <a href="https://esposure.gg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Esposure.gg →
                  </a>
                </li>
                <li>
                  <a href="https://esposure4all.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Esposure4All.org →
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="text-center">
              <h3 className="font-bold text-white mb-3 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-white/60">
            <p>&copy; 2025 PathCTE by <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white underline">Pathfinity.ai</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ValuePointProps {
  text: string;
}

function ValuePoint({ text }: ValuePointProps) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-300 flex-shrink-0 mt-0.5" />
      <span className="text-white/95 font-medium text-sm sm:text-base">{text}</span>
    </li>
  );
}
