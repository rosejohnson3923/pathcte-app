import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-teal-500 to-purple-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src="/pathCTE_wNoText_Light.svg"
              alt="PathCTE"
              className="h-24 w-24"
            />
            <span className="text-3xl font-display font-bold text-white">PathCTE</span>
          </Link>
          <Link
            to="/"
            className="px-6 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg shadow-lg font-semibold transition-all hover:scale-105"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/90">
              Last updated: January 2025
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Our Commitment to Privacy</h2>
              <p className="text-white/90">
                PathCTE, operated by Pathfinity.ai, is committed to protecting the privacy and security of our users, especially students. We comply with all applicable privacy laws including FERPA (Family Educational Rights and Privacy Act) and COPPA (Children's Online Privacy Protection Act).
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Account Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                    <li>Name (first and last)</li>
                    <li>Email address</li>
                    <li>Role (student, teacher, or parent)</li>
                    <li>School affiliation (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Educational Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                    <li>Game participation and scores</li>
                    <li>Career Pathkeys collected</li>
                    <li>XP earned and progress tracking</li>
                    <li>Question responses (for learning analytics)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                    <li>Device type and browser information</li>
                    <li>IP address (for security purposes)</li>
                    <li>Usage patterns and timestamps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">How We Use Your Information</h2>
              <p className="text-white/90 mb-2">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Provide and improve our educational services</li>
                <li>Track student progress and engagement</li>
                <li>Generate analytics for teachers and administrators</li>
                <li>Personalize the learning experience</li>
                <li>Communicate important updates and support</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Data Sharing and Disclosure</h2>
              <p className="font-semibold mb-2 text-white">We DO NOT:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Sell student data to third parties</li>
                <li>Use student data for advertising purposes</li>
                <li>Share personal information without consent</li>
              </ul>

              <p className="font-semibold mb-2 mt-4 text-white">We MAY share data:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>With teachers and school administrators (for enrolled students)</li>
                <li>With parents (upon verified request)</li>
                <li>With service providers who help us operate the platform (under strict confidentiality agreements)</li>
                <li>When required by law or to protect safety</li>
              </ul>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Student Data Protection</h2>
              <p className="text-white/90 mb-2">
                For users under 13, we comply with COPPA requirements:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>We collect minimal personal information</li>
                <li>Parental consent is obtained through schools or parents</li>
                <li>Parents can review and request deletion of their child's data</li>
                <li>Student data is never used for targeted advertising</li>
              </ul>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Data Security</h2>
              <p className="text-white/90 mb-2">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure data storage with access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>Employee training on data privacy</li>
              </ul>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Your Rights and Choices</h2>
              <p className="text-white/90 mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Access your personal data</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communications</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="mt-3 text-white/90">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@pathcte.com" className="text-white font-semibold hover:text-white/80 underline">
                  privacy@pathcte.com
                </a>
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Cookies and Tracking</h2>
              <p className="text-white/90">
                We use essential cookies to maintain your session and preferences. We do not use third-party tracking or advertising cookies.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Third-Party Services</h2>
              <p className="text-white/90 mb-2">
                PathCTE uses the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Supabase (authentication and database hosting)</li>
                <li>Azure Communication Services (email delivery)</li>
                <li>Azure Blob Storage (image hosting)</li>
              </ul>
              <p className="mt-3 text-white/90">
                These services are bound by strict data processing agreements and only access data necessary to provide their services.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Data Retention</h2>
              <p className="text-white/90">
                We retain your data for as long as your account is active or as needed to provide services. When you delete your account, we remove personal data within 30 days, though some anonymized data may be retained for analytics purposes.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Changes to This Policy</h2>
              <p className="text-white/90">
                We may update this Privacy Policy from time to time. We will notify users of significant changes via email or in-app notification. Continued use of PathCTE after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
              <p className="text-white/90 mb-3">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-4 bg-white/20 rounded-lg border border-white/40">
                <p className="font-semibold text-white">PathCTE Privacy Team</p>
                <p className="text-white/90">Email: <a href="mailto:privacy@pathcte.com" className="text-white font-semibold hover:text-white/80 underline">privacy@pathcte.com</a></p>
                <p className="mt-2 text-sm text-white/80">
                  Parent of Pathfinity.ai<br />
                  Visit: <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-white/80 underline">pathfinity.ai</a>
                </p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/40 text-center">
              <p className="text-white/90 text-sm font-medium">
                PathCTE is committed to protecting student privacy and complying with all applicable education privacy laws.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/60">
        <p>&copy; 2025 PathCTE by <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white underline">Pathfinity.ai</a>. All rights reserved.</p>
      </footer>
    </div>
  );
}
