import { Link } from 'react-router-dom';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

export default function ContactPage() {
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
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-white/90">
              We'd love to hear from you! Reach out with any questions or feedback.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Email</h3>
              <a href="mailto:support@pathcte.com" className="text-white/90 hover:text-white font-medium">
                support@pathcte.com
              </a>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Feedback</h3>
              <a href="mailto:feedback@pathcte.com" className="text-white/90 hover:text-white font-medium">
                feedback@pathcte.com
              </a>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Support</h3>
              <a href="mailto:help@pathcte.com" className="text-white/90 hover:text-white font-medium">
                help@pathcte.com
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">General Inquiries</h2>
              <p className="text-white/90 mb-2">
                For general questions about PathCTE, our educational approach, or partnership opportunities, please email us at{' '}
                <a href="mailto:support@pathcte.com" className="text-white font-semibold hover:text-white/80 underline">
                  support@pathcte.com
                </a>
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Technical Support</h2>
              <p className="text-white/90 mb-2">
                Experiencing technical issues? Our support team is here to help. Please include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>A description of the issue</li>
                <li>What you were doing when it occurred</li>
                <li>Your device and browser information</li>
                <li>Any error messages you received</li>
              </ul>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">Schools & Teachers</h2>
              <p className="text-white/90 mb-2">
                Interested in bringing PathCTE to your school or district? We offer:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-white/90">
                <li>Free access for all students and teachers</li>
                <li>Professional development workshops</li>
                <li>Custom question sets aligned to your curriculum</li>
                <li>Analytics and reporting tools</li>
              </ul>
              <p className="mt-3 text-white/90">
                Contact us at{' '}
                <a href="mailto:schools@pathcte.com" className="text-white font-semibold hover:text-white/80 underline">
                  schools@pathcte.com
                </a>
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-white mb-3">About Pathfinity</h2>
              <p className="text-white/90 mb-2">
                PathCTE is part of the{' '}
                <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-white/80 underline">
                  Pathfinity.ai
                </a>{' '}
                family of educational products. For inquiries about our full Career-First Learning platform, PathIQ AI personalization, or Finn AI agents, visit{' '}
                <a href="https://pathfinity.ai" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-white/80 underline">
                  pathfinity.ai
                </a>
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/40 text-center">
              <p className="text-white/90 font-medium">
                We typically respond to inquiries within 1-2 business days.
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
