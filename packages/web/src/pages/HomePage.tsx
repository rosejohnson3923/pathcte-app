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
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Explore Careers
            <br />
            <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Through Play
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Unlock career "Pathkeys" by playing educational games. Learn about hundreds of careers
            while having fun!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <button className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white/10">
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
    <div className="glass rounded-2xl p-6 text-white border border-white/20 hover:border-white/40 transition-all">
      <div className="text-yellow-300 mb-4">{icon}</div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}
