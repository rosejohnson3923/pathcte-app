/**
 * Market Page
 * ===========
 * Marketplace for purchasing pathkeys, booster packs, and other items
 */

import { DashboardLayout } from '../components/layout';
import { ShoppingCart } from 'lucide-react';

export default function MarketPage() {
  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 overflow-hidden">
          {/* Decorative Icons */}
          <div className="absolute inset-0 opacity-10">
            <ShoppingCart className="absolute top-5 right-10 w-20 h-20 text-white" />
            <ShoppingCart className="absolute bottom-5 left-10 w-16 h-16 text-white" />
            <ShoppingCart className="absolute top-1/2 right-1/4 w-12 h-12 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <ShoppingCart className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                Market
              </h1>
            </div>
            <p className="text-purple-100 text-lg ml-20">
              Purchase pathkeys, booster packs, and exclusive items
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
            <ShoppingCart className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            The marketplace is currently under development. Check back soon to purchase pathkeys, booster packs, and other exciting items!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
