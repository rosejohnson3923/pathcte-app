import { DashboardLayout } from '../components/layout';
import { Card } from '../components/common';
import { Gamepad2, Trophy, Users, Zap, Target, Key, Lock, Image } from 'lucide-react';

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
              Learn how PathCTE works and start collecting Pathkeys!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Game Overview */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">What is PathCTE?</h2>
            <p className="text-text-secondary mb-4">
              PathCTE helps you explore careers through fun, competitive games. Answer questions about different jobs,
              compete with classmates, and collect Pathkeys that show your career exploration progress.
            </p>
            <p className="text-text-secondary">
              Each Pathkey represents a specific career (like Software Engineer, Nurse, or Marketing Manager).
              You can earn up to <strong>3 sections</strong> for each career Pathkey by demonstrating different types of mastery.
            </p>
          </Card>

          {/* How It Works */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* For Students */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">For Students</h3>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-text-secondary">
                  <li><strong>Get the Game Code</strong> - Your teacher will share a 6-character code</li>
                  <li><strong>Click "Join Game"</strong> - Enter the code to join the game</li>
                  <li><strong>Wait in Lobby</strong> - See other players joining and wait for the game to start</li>
                  <li><strong>Answer Questions</strong> - Read each question and select your answer before time runs out</li>
                  <li><strong>Earn Rewards</strong> - Collect Pathkeys and XP based on your performance</li>
                </ol>
              </div>

              {/* For Teachers */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">For Teachers</h3>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-text-secondary">
                  <li><strong>Click "Host Game"</strong> - Choose a question set and game settings</li>
                  <li><strong>Share the Code</strong> - Display the 6-character code for students to join</li>
                  <li><strong>Start the Game</strong> - Click "Start Game" when everyone is ready</li>
                  <li><strong>Control the Flow</strong> - Advance questions manually or let them auto-advance</li>
                  <li><strong>View Results</strong> - See scores, rankings, and Pathkeys earned</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Pathkey System */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">How Pathkeys Work</h2>
            <p className="text-text-secondary mb-6">
              Each career has a Pathkey with <strong>3 sections</strong> you can unlock by showing mastery in different ways.
              The more sections you unlock, the more complete your Pathkey becomes!
            </p>

            <div className="space-y-4">
              {/* Section 1 */}
              <div className="border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Image className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Section 1: Career Image 🎯</h3>
                    <p className="text-text-secondary mb-2">
                      <strong>How to earn:</strong> Finish in the <strong>Top 3</strong> when playing a Career mode game.
                    </p>
                    <p className="text-sm text-text-secondary">
                      Example: Play "Software Engineer" Career mode, finish 1st, 2nd, or 3rd place → Career image unlocks!
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Section 2: Lock 🔒</h3>
                    <p className="text-text-secondary mb-2">
                      <strong>How to earn:</strong> Complete <strong>3 question sets</strong> with <strong>90% accuracy</strong> or better.
                    </p>
                    <p className="text-sm text-text-secondary mb-2">
                      <strong>Two ways to unlock:</strong>
                    </p>
                    <ul className="text-sm text-text-secondary list-disc list-inside ml-2 space-y-1">
                      <li><strong>Industry Path:</strong> Play 3 Industry sets matching the career's sector</li>
                      <li><strong>Cluster Path:</strong> Play 3 Cluster sets matching the career's cluster</li>
                    </ul>
                    <p className="text-sm text-text-secondary mt-2">
                      Note: You must unlock Section 1 first before Section 2 progress counts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Key className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Section 3: Key 🔑</h3>
                    <p className="text-text-secondary mb-2">
                      <strong>How to earn:</strong> Master all <strong>6 business drivers</strong> (the 6 P's).
                    </p>
                    <p className="text-sm text-text-secondary mb-2">
                      For each driver, answer <strong>5 questions correctly</strong> with <strong>90% accuracy</strong> (at least 4 out of 5).
                      If you miss too many, that driver resets and you try again.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="text-sm text-text-secondary">👥 People</div>
                      <div className="text-sm text-text-secondary">📦 Product</div>
                      <div className="text-sm text-text-secondary">💰 Pricing</div>
                      <div className="text-sm text-text-secondary">⚙️ Process</div>
                      <div className="text-sm text-text-secondary">📈 Proceeds</div>
                      <div className="text-sm text-text-secondary">💎 Profits</div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      Note: Only works in Career mode games. Progress saves across multiple games.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Features */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Other Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Experience Points (XP)</h3>
                <p className="text-sm text-text-secondary">
                  Earn XP for every game you play. The better you perform, the more XP you earn!
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Explore Careers</h3>
                <p className="text-sm text-text-secondary">
                  Browse the Careers page to learn about different jobs and plan your pathkey collection.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Track Progress</h3>
                <p className="text-sm text-text-secondary">
                  Visit "My Pathkeys" to see all your unlocked careers and track your progress toward each section.
                </p>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Tips for Success</h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Focus on one career at a time</strong> - It's easier to complete all 3 sections for one career than to partially complete many</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Read questions carefully</strong> - Speed is important, but accuracy matters more for unlocking sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Play Career mode for business drivers</strong> - Section 3 (Key) only tracks progress in Career mode games</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Check your progress regularly</strong> - Visit "My Pathkeys" to see how close you are to unlocking each section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Compete with friends</strong> - Top 3 finishes are easier in smaller games, so practice makes perfect!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                <span><strong>Explore different careers</strong> - You might discover a career path you never knew existed</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
