/**
 * UI Store
 * ========
 * Zustand store for UI state management
 * Platform-agnostic: Works in web and mobile
 */

import { create } from 'zustand';
import type { Theme } from '../design-system/theme';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
}

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modals
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;

  // Sidebar (for web)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile menu (for mobile)
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Errors
  errors: Record<string, string>;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
}

let toastIdCounter = 0;
let modalIdCounter = 0;

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

export const useUIStore = create<UIState>((set, get) => ({
  // Theme
  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    // Apply theme to DOM (web only)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      // Also add/remove 'dark' class for Tailwind
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    // Save to storage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  },
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${toastIdCounter++}`;
    const newToast: Toast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after duration
    if (toast.duration !== 0) {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modals
  modals: [],
  openModal: (modal) => {
    const id = `modal-${modalIdCounter++}`;
    const newModal: Modal = { ...modal, id };

    set((state) => ({
      modals: [...state.modals, newModal],
    }));

    return id;
  },
  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },
  closeAllModals: () => {
    set({ modals: [] });
  },

  // Loading states
  globalLoading: false,
  loadingStates: {},
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },
  setLoading: (key, loading) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },
  clearLoading: (key) => {
    set((state) => {
      const newLoadingStates = { ...state.loadingStates };
      delete newLoadingStates[key];
      return { loadingStates: newLoadingStates };
    });
  },

  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },

  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },
  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open });
  },

  // Errors
  errors: {},
  setError: (key, error) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [key]: error,
      },
    }));
  },
  clearError: (key) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[key];
      return { errors: newErrors };
    });
  },
  clearAllErrors: () => {
    set({ errors: {} });
  },
}));

// Helper functions for common toast types
export const toast = {
  success: (message: string, duration?: number) => {
    return useUIStore.getState().addToast({ type: 'success', message, duration });
  },
  error: (message: string, duration?: number) => {
    return useUIStore.getState().addToast({ type: 'error', message, duration });
  },
  warning: (message: string, duration?: number) => {
    return useUIStore.getState().addToast({ type: 'warning', message, duration });
  },
  info: (message: string, duration?: number) => {
    return useUIStore.getState().addToast({ type: 'info', message, duration });
  },
};
