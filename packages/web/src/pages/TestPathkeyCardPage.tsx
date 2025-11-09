/**
 * Test Pathkey Card Page
 * ======================
 * Isolated test page for the CareerPathkeyCard component
 * Displays mock data for a fully completed pathkey
 */

import React, { useState } from 'react';
import { CareerPathkeyCard } from '../components/pathkeys/CareerPathkeyCard';
import type { CareerPathkeyCardProps } from '../components/pathkeys/CareerPathkeyCard';
import { buildAzureUrl } from '../config/azure';

export const TestPathkeyCardPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'complete' | 'section1' | 'section1+2' | 'inProgress'>('complete');

  // Mock data for fully completed pathkey
  const completePathkey: CareerPathkeyCardProps = {
    careerId: 'c9525a26-27a7-43e3-9c63-cccf82119fd8',
    careerTitle: 'Public Relations Specialist',
    careerSector: 'Marketing & Community',
    careerCluster: 'Marketing',

    section1: {
      unlocked: true,
      unlockedAt: '2025-01-08T10:30:00Z',
    },

    section2: {
      unlocked: true,
      unlockedAt: '2025-01-08T14:45:00Z',
      via: 'industry',
      progress: 3,
      required: 3,
    },

    section3: {
      unlocked: true,
      unlockedAt: '2025-01-08T18:20:00Z',
      drivers: [
        { driver: 'people', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'product', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'pricing', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'process', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'proceeds', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'profits', mastered: true, currentProgress: 5, required: 5 },
      ],
    },

    images: {
      career: buildAzureUrl('pathkeys', 'PR-001.png'),
      lock: buildAzureUrl('pathkeys', 'MILE-FIRST.png'),
      key: buildAzureUrl('pathkeys', 'SKILL-CODE.png'),
    },

    showProgress: true,
  };

  // Only Section 1 unlocked
  const section1OnlyPathkey: CareerPathkeyCardProps = {
    ...completePathkey,
    section2: {
      unlocked: false,
      progress: 1,
      required: 3,
    },
    section3: {
      unlocked: false,
      drivers: [
        { driver: 'people', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'product', mastered: false, currentProgress: 2, required: 5 },
        { driver: 'pricing', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'process', mastered: false, currentProgress: 4, required: 5 },
        { driver: 'proceeds', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'profits', mastered: false, currentProgress: 1, required: 5 },
      ],
    },
  };

  // Sections 1 & 2 unlocked
  const section1And2Pathkey: CareerPathkeyCardProps = {
    ...completePathkey,
    section3: {
      unlocked: false,
      drivers: [
        { driver: 'people', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'product', mastered: true, currentProgress: 5, required: 5 },
        { driver: 'pricing', mastered: false, currentProgress: 3, required: 5 },
        { driver: 'process', mastered: false, currentProgress: 4, required: 5 },
        { driver: 'proceeds', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'profits', mastered: false, currentProgress: 1, required: 5 },
      ],
    },
  };

  // No sections unlocked (in progress)
  const inProgressPathkey: CareerPathkeyCardProps = {
    ...completePathkey,
    section1: {
      unlocked: false,
    },
    section2: {
      unlocked: false,
      progress: 0,
      required: 3,
    },
    section3: {
      unlocked: false,
      drivers: [
        { driver: 'people', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'product', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'pricing', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'process', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'proceeds', mastered: false, currentProgress: 0, required: 5 },
        { driver: 'profits', mastered: false, currentProgress: 0, required: 5 },
      ],
    },
  };

  const pathkeys: Record<typeof selectedView, CareerPathkeyCardProps> = {
    complete: completePathkey,
    section1: section1OnlyPathkey,
    'section1+2': section1And2Pathkey,
    inProgress: inProgressPathkey,
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Career Pathkey Card - Component Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Isolated test for the three-section pathkey award system
          </p>
        </div>

        {/* View Selector */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Test Scenario
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedView('complete')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedView === 'complete'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold mb-1">Complete</div>
              <div className="text-xs opacity-75">All 3 Sections</div>
            </button>

            <button
              onClick={() => setSelectedView('section1')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedView === 'section1'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold mb-1">Section 1 Only</div>
              <div className="text-xs opacity-75">Career Image</div>
            </button>

            <button
              onClick={() => setSelectedView('section1+2')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedView === 'section1+2'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold mb-1">Sections 1 & 2</div>
              <div className="text-xs opacity-75">Image + Lock</div>
            </button>

            <button
              onClick={() => setSelectedView('inProgress')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedView === 'inProgress'
                  ? 'border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold mb-1">In Progress</div>
              <div className="text-xs opacity-75">No Unlocks</div>
            </button>
          </div>
        </div>

        {/* Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Component Preview (Baseball Card Size) */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Baseball Card Preview
            </h2>
            <div className="max-w-xs mx-auto">
              <CareerPathkeyCard {...pathkeys[selectedView]} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Portrait 3:4 aspect ratio<br />
              (Like a baseball card)
            </p>
          </div>

          {/* Right: Data Structure */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Component Props
            </h2>
            <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-[800px]">
              <pre className="text-green-400 text-xs font-mono">
                {JSON.stringify(pathkeys[selectedView], null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Baseball Card Layout
          </h2>

          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">
              📊 Composite Design
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              The three sections are arranged in a single baseball card-style layout:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 text-sm list-disc list-inside space-y-1">
              <li><strong>Top (60%):</strong> Career Image - Large main section</li>
              <li><strong>Bottom Left (20%):</strong> Lock Image - Small section</li>
              <li><strong>Bottom Right (20%):</strong> Key Image - Small section (rotated 45°)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
              <strong>Aspect Ratio:</strong> 3:4 (portrait, like a baseball card)
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            How to Earn Each Section
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-1 text-sm">
                🎯 Section 1: Career Mastery (Top - Career Image)
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                Finish in the <strong>Top 3</strong> in a Career mode game for this specific career.
                Requires 3+ total players.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
              <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1 text-sm">
                🔒 Section 2: Industry/Cluster (Bottom Left - Lock)
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                <strong>Prerequisite:</strong> Section 1 unlocked. Complete <strong>3 question sets</strong> with <strong>90% accuracy</strong>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500">
              <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-1 text-sm">
                🔑 Section 3: Business Drivers (Bottom Right - Key)
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                <strong>Prerequisite:</strong> Section 1 unlocked. Master all <strong>6 business drivers</strong> (5 questions each at 90%).
              </p>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
            ℹ️ Test Information
          </h2>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p><strong>Career:</strong> Public Relations Specialist</p>
            <p><strong>Sector:</strong> Marketing & Community</p>
            <p><strong>Cluster:</strong> Marketing</p>
            <p><strong>Storage:</strong> Azure Blob Storage (pathctestore account)</p>
            <p><strong>Container:</strong> pathkeys</p>
            <p><strong>Student:</strong> Mock data for student@esposure.gg</p>
          </div>

          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              <strong>✅ Images Loaded from Azure:</strong> The component loads existing pathkey images from Azure Blob Storage:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
              <li>PR-001.png (Career image - Public Relations pathkey)</li>
              <li>MILE-FIRST.png (Lock image - First Milestone pathkey)</li>
              <li>SKILL-CODE.png (Key image - Coding Skill pathkey)</li>
            </ul>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              These use the existing pathkey collection images to demonstrate the three-section award system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
