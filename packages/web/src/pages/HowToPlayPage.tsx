import { DashboardLayout } from '../components/layout';
import { Card } from '../components/common';
import { Gamepad2, Trophy, Users, Zap, Target, Award, Sparkles } from 'lucide-react';

export default function HowToPlayPage() {
  return (
    <DashboardLayout>
      <div>
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Gamepad2 className="h-10 w-10 text-white" />
              <h1 className="text-4xl font-display font-bold text-white">How to Play</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Learn the basics of PathCTE and start your career exploration journey!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Game Overview */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Game Overview</h2>
            <p className="text-text-secondary mb-4">
              PathCTE is a fun, educational platform where you play games to explore over 1,000 careers.
              Answer questions about different careers, collect Pathkeys, earn XP, and compete with your classmates!
            </p>
          </Card>

          {/* How It Works */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* For Students */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">For Students</h3>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-text-secondary">
                  <li><strong>Join a Game:</strong> Enter the game code from your teacher</li>
                  <li><strong>Answer Questions:</strong> Learn about careers through fun trivia</li>
                  <li><strong>Collect Pathkeys:</strong> Earn rare career Pathkeys for correct answers</li>
                  <li><strong>Earn XP:</strong> Build your XP total and level up</li>
                  <li><strong>Compete:</strong> See your rank on the leaderboard</li>
                </ol>
              </div>

              {/* For Teachers */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">For Teachers</h3>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-text-secondary">
                  <li><strong>Create/Select Questions:</strong> Choose from ready-made question sets</li>
                  <li><strong>Host a Game:</strong> Start a live game session</li>
                  <li><strong>Share Game Code:</strong> Students join using the code</li>
                  <li><strong>Track Progress:</strong> Monitor student engagement in real-time</li>
                  <li><strong>View Analytics:</strong> Review performance and career interests</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Key Features */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Pathkeys Collection</h3>
                <p className="text-sm text-text-secondary">
                  Collect unique career Pathkeys with different rarity levels. Complete your collection!
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">XP System</h3>
                <p className="text-sm text-text-secondary">
                  Earn XP for answering questions correctly. Watch your XP grow with every game!
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Career Discovery</h3>
                <p className="text-sm text-text-secondary">
                  Explore 1,000+ careers you never knew existed. Find your passion!
                </p>
              </div>
            </div>
          </Card>

          {/* Pathkey Rarities */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Pathkey Rarities</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Common</h4>
                  <p className="text-sm text-text-secondary">Easier to collect, great starting point</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Uncommon</h4>
                  <p className="text-sm text-text-secondary">Moderate rarity, keep playing to find them</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Rare</h4>
                  <p className="text-sm text-text-secondary">Hard to find, shows dedication</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Epic</h4>
                  <p className="text-sm text-text-secondary">Very rare, for true collectors</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Legendary</h4>
                  <p className="text-sm text-text-secondary">Extremely rare, ultimate bragging rights!</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Tips for Success</h2>
            <ul className="space-y-2 text-text-secondary list-disc list-inside">
              <li>Play regularly to increase your chances of collecting rare Pathkeys</li>
              <li>Read questions carefully - some careers might surprise you!</li>
              <li>Explore the Careers page to learn more about the careers you discover</li>
              <li>Check your Collection page to see which Pathkeys you still need</li>
              <li>Have fun and keep an open mind about different career paths</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
