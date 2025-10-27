import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Key className="h-10 w-10 text-white" />
            <span className="text-3xl font-display font-bold text-white">Pathket</span>
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="card">
          <h1 className="text-2xl font-display font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-600 mb-6">Start exploring careers today</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select id="user-type" className="input" required>
                <option value="">Select...</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="input"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" id="last-name" className="input" placeholder="Doe" required />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
              <label className="flex items-start">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 mt-0.5" required />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
