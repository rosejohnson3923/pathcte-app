import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-teal-500 to-purple-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/pathCTE_wNoText_Light.svg"
              alt="PathCTE"
              className="h-24 w-24"
            />
            <span className="text-3xl font-display font-bold text-white">PathCTE</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg shadow-lg font-semibold transition-all hover:scale-105"
            >
              Sign Up Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                ✨ 100% FREE for Students & Teachers
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-3 leading-tight">
              Career Exploration
              <br />
              Made <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Fun</span>
            </h1>
            <p className="text-lg text-white/80 mb-6 font-medium">
              PathCTE (pronounced <span className="font-bold text-white">"Path-SET"</span>)
            </p>
            <p className="text-xl md:text-2xl text-white/95 font-medium max-w-3xl mx-auto leading-relaxed">
              Play educational games, discover 1,000+ career and industry gamesets, and unlock your future—all completely free
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <Link
              to="/signup"
              className="px-10 py-5 bg-white text-purple-600 hover:bg-gray-50 rounded-xl shadow-2xl font-bold text-xl transition-all hover:scale-105 hover:shadow-purple-500/50"
            >
              Get Started Free →
            </Link>
          </div>

          {/* Two-Column Value Props */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* For Students */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">For Students</h2>
              </div>
              <ul className="space-y-3">
                <ValuePoint text="Play fun games with your classmates" />
                <ValuePoint text="Discover careers you never knew existed" />
                <ValuePoint text="Collect rare career Pathkeys" />
                <ValuePoint text="Compete on leaderboards" />
              </ul>
            </div>

            {/* For Teachers/Parents */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">For Teachers/Parents</h2>
              </div>
              <ul className="space-y-3">
                <ValuePoint text="Engage students with gamified CTE" />
                <ValuePoint text="Track student career exploration" />
                <ValuePoint text="Ready-to-use question sets" />
                <ValuePoint text="Real-time analytics dashboard" />
              </ul>
            </div>
          </div>

          {/* How It Works - PathCTE → Pathfinity */}
          <div id="how-it-works" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Gateway to Career-First Learning
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                PathCTE is the fun introduction to a revolutionary educational approach
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/40 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* PathCTE Side */}
                <div className="bg-teal-600/30 backdrop-blur-sm rounded-xl p-6 border border-teal-400/30">
                  <div className="inline-block bg-teal-400/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-teal-300/50">
                    <span className="text-white font-bold text-sm drop-shadow">START HERE: PathCTE</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">Discover Your Future</h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow">Play career exploration games</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow">Collect career Pathkeys</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow">Discover what excites you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow">100% free, always</span>
                    </li>
                  </ul>
                </div>

                {/* Arrow & Pathfinity Side */}
                <div className="bg-purple-600/30 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
                  <div className="text-center mb-6 md:mb-8">
                    <div className="text-white text-4xl font-bold drop-shadow">→</div>
                    <div className="text-white text-sm mt-2 font-medium drop-shadow">Then unlock</div>
                  </div>
                  <div className="inline-block bg-purple-400/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-300/50">
                    <span className="text-white font-bold text-sm drop-shadow">LEVEL UP: Pathfinity.ai</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">Transform Your Education</h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow"><strong>BE a professional</strong> every day (K-12)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow"><strong>PathIQ AI</strong> personalizes your learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow"><strong>6 Finn AI agents</strong> guide you 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-200 flex-shrink-0 mt-0.5 drop-shadow" />
                      <span className="font-medium drop-shadow">Full Career-First education revolution</span>
                    </li>
                  </ul>
                  <a
                    href="https://pathfinity.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-bold transition-all shadow-lg"
                  >
                    Learn About Pathfinity.ai →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Simple Stats */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">1,000+</div>
                <div className="text-white/80 font-medium">Career Pathways</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <div className="text-white/80 font-medium">Game Modes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80 font-medium">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-white/80">
        <div className="max-w-5xl mx-auto">
          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* PathCTE */}
            <div className="text-center">
              <h3 className="font-bold text-white mb-3">PathCTE</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Pathfinity Family */}
            <div className="text-center">
              <h3 className="font-bold text-white mb-3">Pathfinity Family</h3>
              <ul className="space-y-2 text-sm">
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
              <h3 className="font-bold text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
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
      <CheckCircle2 className="h-5 w-5 text-teal-300 flex-shrink-0 mt-0.5" />
      <span className="text-white/95 font-medium">{text}</span>
    </li>
  );
}
