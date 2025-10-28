import { Link } from 'react-router-dom';
import { Gamepad2, Key, Users, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="h-8 w-8 text-white" />
            <span className="text-2xl font-display font-bold text-white">Pathket</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn-ghost text-white hover:bg-white/10">
              Log In
            </Link>
            <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 drop-shadow-lg">
            Explore Careers
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-none font-extrabold">
              Through Play
            </span>
          </h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/20">
            <p className="text-xl text-white font-medium leading-relaxed">
              Unlock career "Pathkeys" by playing educational games. Learn about hundreds of careers
              while having fun!
            </p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100 font-semibold shadow-xl"
            >
              Get Started Free
            </Link>
            <button className="btn-outline text-lg px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<Gamepad2 className="h-8 w-8" />}
            title="20+ Game Modes"
            description="From Career Quest to Path Defense, explore careers through engaging gameplay"
          />
          <FeatureCard
            icon={<Key className="h-8 w-8" />}
            title="Collect Pathkeys"
            description="Unlock rare career collectibles and build your collection"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Play Together"
            description="Join live multiplayer games with classmates and friends"
          />
          <FeatureCard
            icon={<Trophy className="h-8 w-8" />}
            title="Earn Rewards"
            description="Complete achievements and climb leaderboards"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/70">
        <p>&copy; 2025 Pathket. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/20 transition-all shadow-lg">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center mb-4 shadow-lg">
        <div className="text-white drop-shadow-md">{icon}</div>
      </div>
      <h3 className="font-display text-xl font-bold mb-3 drop-shadow-md">{title}</h3>
      <p className="text-white font-medium text-sm leading-relaxed">{description}</p>
    </div>
  );
}
