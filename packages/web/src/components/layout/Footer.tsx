/**
 * Footer Component
 * =================
 * Site footer with links and information
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Key, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Key className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-display font-bold text-white">Pathket</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              Unlock your future with engaging career exploration games. Learn about careers, earn
              pathkeys, and discover your path forward.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/careers" className="text-sm hover:text-purple-400 transition-colors">
                  Explore Careers
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-sm hover:text-purple-400 transition-colors">
                  Pathkeys
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-sm hover:text-purple-400 transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm hover:text-purple-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Pathket. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 sm:mt-0">
            Built with ❤️ for career exploration
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
