import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthStore, toast } from '@pathcte/shared';
import { Button, Input } from '../components/common';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | ''>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    terms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!role) {
      newErrors.role = 'Please select your role';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[SignUpPage] Form submitted');

    if (!validateForm()) {
      console.log('[SignUpPage] Validation failed');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const signUpData = {
      email,
      password,
      fullName,
      role: role as 'student' | 'teacher' | 'parent',
    };

    console.log('[SignUpPage] Attempting signup with:', {
      email: signUpData.email,
      fullName: signUpData.fullName,
      role: signUpData.role,
      passwordLength: signUpData.password.length,
    });

    try {
      const result = await signUp(signUpData);
      console.log('[SignUpPage] Signup result:', { success: result.success, error: result.error });

      if (result.success) {
        // Check if email confirmation is required
        if (result.error && result.error.includes('email')) {
          toast.success('Account created! Please check your email to confirm your account.');
          console.log('[SignUpPage] Email confirmation required, redirecting to login');
          navigate('/login');
        } else {
          toast.success('Account created! Welcome to Pathcte!');
          console.log('[SignUpPage] Navigating to dashboard');
          navigate('/dashboard');
        }
      } else {
        const errorMessage = result.error || 'Failed to create account';
        console.error('[SignUpPage] Signup failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('[SignUpPage] Unexpected error during signup:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-teal-500 to-purple-600 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <img
              src="/pathCTE_wNoText_Light.svg"
              alt="PathCTE"
              className="h-16 w-16"
            />
            <span className="text-3xl font-display font-bold text-white">PathCTE</span>
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-center mb-2 text-gray-900">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-6">Start exploring careers today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                id="user-type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                disabled={isLoading}
                required
              >
                <option value="">Select...</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName}
                leftIcon={<User size={20} />}
                fullWidth
                forceLight
                disabled={isLoading}
                autoComplete="given-name"
              />
              <Input
                type="text"
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName}
                leftIcon={<User size={20} />}
                fullWidth
                forceLight
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>

            {/* Email */}
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={20} />}
              fullWidth
              forceLight
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Password */}
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              forceLight
              helperText="Minimum 8 characters"
              leftIcon={<Lock size={20} />}
              fullWidth
              disabled={isLoading}
              autoComplete="new-password"
            />

            {/* Confirm Password */}
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock size={20} />}
              fullWidth
              disabled={isLoading}
              autoComplete="new-password"
            />

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            PathCTE (pronounced <span className="font-semibold text-gray-700">"Path-SET"</span>)
          </p>
        </div>
      </div>
    </div>
  );
}
