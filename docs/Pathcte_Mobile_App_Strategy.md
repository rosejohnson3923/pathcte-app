# PATHCTE MOBILE APP STRATEGY
## React Native Implementation Guide

---

## EXECUTIVE SUMMARY

This document outlines the strategy for building native iOS and Android apps for Pathcte after the web version is stable. By following mobile-first principles during web development, the transition to mobile will be:

- **70% code reuse** from web to mobile (all business logic, hooks, services)
- **3-4 months** to production-ready mobile apps
- **Single codebase** for iOS and Android (React Native)
- **Consistent experience** across all platforms

---

## TABLE OF CONTENTS

1. [Why React Native?](#1-why-react-native)
2. [Development Timeline](#2-development-timeline)
3. [Architecture Strategy](#3-architecture-strategy)
4. [Code Migration Patterns](#4-code-migration-patterns)
5. [Platform-Specific Features](#5-platform-specific-features)
6. [Performance Optimization](#6-performance-optimization)
7. [App Store Preparation](#7-app-store-preparation)
8. [Testing Strategy](#8-testing-strategy)
9. [Deployment Pipeline](#9-deployment-pipeline)
10. [Maintenance Strategy](#10-maintenance-strategy)

---

## 1. WHY REACT NATIVE?

### 1.1 Advantages for Pathcte

**Code Reuse:**
- Share 100% of business logic with web
- Share 100% of TypeScript types
- Share 90% of hooks and state management
- Share 80% of API/database code

**Development Speed:**
- One team can build all platforms
- Write UI once, deploy to iOS + Android
- Hot reload for rapid development
- Leverage existing React expertise

**Native Performance:**
- True native components (not WebView)
- 60fps animations with Reanimated
- Native modules for device features
- Comparable to Swift/Kotlin apps

**Ecosystem:**
- Mature library ecosystem
- Strong community support
- Expo for easier development
- OTA updates (skip app store for bug fixes)

### 1.2 React Native vs. Alternatives

| Technology | Code Reuse | Performance | Dev Speed | Native Feel |
|------------|------------|-------------|-----------|-------------|
| **React Native** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Flutter | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Native (Swift/Kotlin) | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ionic/Capacitor | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

**Recommendation:** React Native with Expo is the optimal choice for Pathcte because:
1. Maximizes code reuse from existing React web app
2. Single JavaScript/TypeScript codebase
3. Fast iteration with hot reload
4. Native performance for games
5. Team already knows React

---

## 2. DEVELOPMENT TIMELINE

### 2.1 Pre-Development (During Web Development)

**Ongoing:** Follow mobile-first patterns in web development
- API-first architecture
- Platform-agnostic services
- Shared type definitions
- Design system tokens
- Touch-friendly UI

### 2.2 Mobile Development Timeline (Post Web Launch)

**Month 1: Setup & Infrastructure**
- Week 1: Project initialization
  - Set up React Native with Expo
  - Configure monorepo structure
  - Move shared code to packages
  - Set up CI/CD for mobile
  
- Week 2: Core infrastructure
  - Navigation setup (React Navigation)
  - Auth flow (mobile optimized)
  - Supabase client configuration
  - Secure storage implementation
  
- Week 3: Design system
  - Convert design tokens to React Native styles
  - Build core UI components (Button, Input, Card)
  - Implement typography system
  - Set up icon library
  
- Week 4: Foundation features
  - Splash screen
  - Onboarding flow
  - Login/Signup screens
  - Basic navigation structure

**Month 2: Core Features**
- Week 5-6: Student features
  - Dashboard
  - Join game flow
  - Pathkey collection
  - Career exploration
  
- Week 7-8: Teacher features
  - Dashboard
  - Host game flow
  - Question set management
  - Analytics (basic)

**Month 3: Game Modes & Polish**
- Week 9-10: Game implementation
  - Career Quest mode
  - Path Defense mode
  - 2-3 additional modes
  - Real-time gameplay
  
- Week 11-12: Mobile-specific features
  - Push notifications
  - Biometric authentication
  - Haptic feedback
  - Camera integration (profile photos)
  - Share functionality

**Month 4: Testing & Launch**
- Week 13-14: Testing
  - Internal testing
  - Beta testing (TestFlight & Play Console)
  - Bug fixes
  - Performance optimization
  
- Week 15-16: Launch preparation
  - App store assets (screenshots, descriptions)
  - App Store Connect setup
  - Google Play Console setup
  - Privacy policy updates
  - Final review & submission

**Timeline Summary:** 16 weeks (4 months) from start to app store launch

---

## 3. ARCHITECTURE STRATEGY

### 3.1 Monorepo Structure

```
pathcte/
├── package.json                         # Root workspace
├── tsconfig.base.json                   # Shared TS config
│
├── packages/
│   ├── shared/                          # ⭐ 70% of codebase
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   ├── utils/
│   │   │   ├── config/
│   │   │   ├── game-engine/
│   │   │   └── design-system/
│   │   └── package.json
│   │
│   ├── web/                             # 🌐 Web application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   └── package.json
│   │
│   └── mobile/                          # 📱 React Native app
│       ├── src/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── navigation/
│       │   └── App.tsx
│       ├── android/
│       ├── ios/
│       ├── app.json                     # Expo config
│       └── package.json
│
└── apps/                                # Alternative structure
    ├── backend/                         # Optional: Separate backend
    └── admin/                           # Optional: Admin dashboard
```

### 3.2 Package Dependencies

```json
// packages/shared/package.json
{
  "name": "@pathcte/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.0"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}

// packages/web/package.json
{
  "name": "@pathcte/web",
  "dependencies": {
    "@pathcte/shared": "*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "tailwindcss": "^3.3.0"
  }
}

// packages/mobile/package.json
{
  "name": "@pathcte/mobile",
  "dependencies": {
    "@pathcte/shared": "*",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    "@react-navigation/native": "^6.1.0",
    "react-native-reanimated": "~3.6.0"
  }
}
```

### 3.3 Import Strategy

```typescript
// Shared code imports from @pathcte/shared
import { useAuth } from '@pathcte/shared/hooks/useAuth';
import { gameService } from '@pathcte/shared/services/game.service';
import { tokens } from '@pathcte/shared/design-system/tokens';

// Web imports platform-specific components
import { Button } from '@pathcte/web/components/common/Button';

// Mobile imports platform-specific components
import { Button } from '@pathcte/mobile/components/common/Button';
```

---

## 4. CODE MIGRATION PATTERNS

### 4.1 Service Layer (100% Reusable)

**No changes needed - works in both platforms!**

```typescript
// packages/shared/src/services/game.service.ts
// ✅ Already mobile-ready

import { supabase } from '../config/supabase';

export const gameService = {
  async createGameSession(hostId: string, questionSetId: string, gameMode: string) {
    const gameCode = generateGameCode();
    
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        game_code: gameCode,
        host_id: hostId,
        question_set_id: questionSetId,
        game_mode: gameMode,
        status: 'waiting',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async joinGame(gameCode: string, displayName: string, userId?: string) {
    // ... implementation
  },
  
  // All other methods work unchanged
};
```

### 4.2 Hooks (95% Reusable)

**Minor adaptations for navigation:**

```typescript
// packages/shared/src/hooks/useAuth.ts
// ✅ Works in both, with platform-specific navigation

import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const { user, profile, setUser, setProfile } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn(email, password);
    setUser(data.user);
    // Don't navigate here - let UI handle it
    return data;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    // Don't navigate here - let UI handle it
  };

  return {
    user,
    profile,
    signIn,
    signOut,
    // ... other methods
  };
};

// Web usage
const { signIn } = useAuth();
const navigate = useNavigate();

await signIn(email, password);
navigate('/dashboard');

// Mobile usage (identical pattern!)
const { signIn } = useAuth();
const navigation = useNavigation();

await signIn(email, password);
navigation.navigate('Dashboard');
```

### 4.3 State Management (100% Reusable)

**Zustand stores work identically:**

```typescript
// packages/shared/src/store/gameStore.ts
// ✅ No changes needed for mobile

import { create } from 'zustand';

interface GameState {
  sessionId: string | null;
  gameCode: string | null;
  status: 'waiting' | 'in_progress' | 'completed';
  players: Player[];
  
  setSession: (sessionId: string, gameCode: string) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  sessionId: null,
  gameCode: null,
  status: 'waiting',
  players: [],
  
  setSession: (sessionId, gameCode) => 
    set({ sessionId, gameCode }),
  
  addPlayer: (player) => 
    set((state) => ({ players: [...state.players, player] })),
  
  updatePlayer: (playerId, updates) => 
    set((state) => ({
      players: state.players.map(p => 
        p.id === playerId ? { ...p, ...updates } : p
      ),
    })),
}));

// Works identically in web and mobile!
const { players, addPlayer } = useGameStore();
```

### 4.4 UI Components (Platform-Specific)

**Shared Interface, Different Implementation:**

```typescript
// ============================================
// SHARED INTERFACE
// ============================================
// packages/shared/src/components/PathkeyCard/PathkeyCard.types.ts

export interface PathkeyCardProps {
  pathkey: {
    id: string;
    name: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    image_url: string;
  };
  owned?: boolean;
  quantity?: number;
  onPress?: () => void;
}

// ============================================
// WEB IMPLEMENTATION
// ============================================
// packages/web/src/components/pathkeys/PathkeyCard.tsx

import { motion } from 'framer-motion';
import { PathkeyCardProps } from '@pathcte/shared/components/PathkeyCard/PathkeyCard.types';

export const PathkeyCard = ({ pathkey, owned, quantity, onPress }: PathkeyCardProps) => {
  return (
    <motion.div
      onClick={onPress}
      className="rounded-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600">
        <img src={pathkey.image_url} alt={pathkey.name} />
      </div>
      <div className="p-3">
        <h3 className="font-semibold">{pathkey.name}</h3>
        {quantity > 1 && <span className="text-xs">x{quantity}</span>}
      </div>
    </motion.div>
  );
};

// ============================================
// MOBILE IMPLEMENTATION
// ============================================
// packages/mobile/src/components/pathkeys/PathkeyCard.tsx

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { PathkeyCardProps } from '@pathcte/shared/components/PathkeyCard/PathkeyCard.types';
import { tokens } from '@pathcte/shared/design-system/tokens';

export const PathkeyCard = ({ pathkey, owned, quantity, onPress }: PathkeyCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: pathkey.image_url }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{pathkey.name}</Text>
          {quantity > 1 && (
            <Text style={styles.quantity}>x{quantity}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: tokens.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 192,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: tokens.spacing.md,
  },
  name: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
  quantity: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.gray[600],
  },
});
```

### 4.5 Navigation Migration

**Web (React Router):**
```typescript
// packages/web/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/game/:gameCode" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Mobile (React Navigation):**
```typescript
// packages/mobile/src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 4.6 Storage Migration

**Web (localStorage):**
```typescript
// packages/web/src/services/storage.web.ts
export const storageService = {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  },
  
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};
```

**Mobile (AsyncStorage):**
```typescript
// packages/mobile/src/services/storage.native.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
```

**Both platforms use same interface:**
```typescript
// packages/shared/src/services/storage.service.ts
export interface StorageService {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
```

---

## 5. PLATFORM-SPECIFIC FEATURES

### 5.1 Mobile-Only Features to Implement

#### Push Notifications

```typescript
// packages/mobile/src/services/notifications.service.ts
import * as Notifications from 'expo-notifications';

export const notificationService = {
  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },
  
  async scheduleNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  },
  
  async scheduleGameReminder(gameTime: Date, gameCode: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Game Starting Soon!',
        body: `Your Pathcte game starts in 5 minutes. Code: ${gameCode}`,
        data: { gameCode },
      },
      trigger: {
        date: new Date(gameTime.getTime() - 5 * 60 * 1000), // 5 min before
      },
    });
  },
};

// Use cases:
// - Homework due reminders
// - Game invitations
// - New pathkeys unlocked
// - Achievement notifications
// - Daily login rewards
```

#### Biometric Authentication

```typescript
// packages/mobile/src/services/biometric.service.ts
import * as LocalAuthentication from 'expo-local-authentication';

export const biometricService = {
  async isAvailable() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },
  
  async getSupportedTypes() {
    return LocalAuthentication.supportedAuthenticationTypesAsync();
  },
  
  async authenticate(reason: string = 'Authenticate to continue') {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: 'Use passcode',
    });
    return result.success;
  },
};

// Use cases:
// - Quick login
// - Teacher grade access
// - Payment confirmation (future)
// - Sensitive settings
```

#### Haptic Feedback

```typescript
// packages/mobile/src/services/haptics.service.ts
import * as Haptics from 'expo-haptics';

export const hapticsService = {
  light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  
  heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  
  success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  warning() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  
  error() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};

// Use cases:
// - Correct/incorrect answer feedback
// - Button presses
// - Unlocking pathkeys
// - Game events
// - Navigation gestures
```

#### Camera Integration

```typescript
// packages/mobile/src/services/camera.service.ts
import * as ImagePicker from 'expo-image-picker';

export const cameraService = {
  async requestPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  },
  
  async takePicture() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  },
  
  async pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  },
};

// Use cases:
// - Profile photo upload
// - Question image upload (teachers)
// - Career project photos (future)
```

#### Share Functionality

```typescript
// packages/mobile/src/services/share.service.ts
import { Share } from 'react-native';

export const shareService = {
  async shareGameCode(gameCode: string) {
    try {
      await Share.share({
        message: `Join my Pathcte game! Code: ${gameCode}\n\nDownload Pathcte: https://pathcte.app`,
        title: 'Join Pathcte Game',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  },
  
  async shareAchievement(achievement: string, imageUrl?: string) {
    try {
      await Share.share({
        message: `I just unlocked: ${achievement} in Pathcte! 🎉`,
        url: imageUrl,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  },
  
  async sharePathkey(pathkeyName: string) {
    try {
      await Share.share({
        message: `I just unlocked the ${pathkeyName} Pathkey! 🔑\n\nExplore careers with Pathcte: https://pathcte.app`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  },
};
```

### 5.2 Platform-Specific UI Patterns

#### iOS-Specific

```typescript
// Safe area handling
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  {/* Content automatically avoids notch and home indicator */}
</SafeAreaView>

// Action sheets (iOS native)
import ActionSheet from 'react-native-action-sheet';

const showOptions = () => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: ['Take Photo', 'Choose from Gallery', 'Cancel'],
      cancelButtonIndex: 2,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) takePicture();
      if (buttonIndex === 1) pickFromGallery();
    }
  );
};
```

#### Android-Specific

```typescript
// Back handler
import { BackHandler } from 'react-native';

useEffect(() => {
  const backAction = () => {
    // Handle back button
    return true; // Prevent default behavior
  };
  
  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  return () => backHandler.remove();
}, []);

// Android-specific permissions
import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
```

---

## 6. PERFORMANCE OPTIMIZATION

### 6.1 List Virtualization

**Problem:** Rendering 1000+ pathkeys or questions kills performance

**Solution:** Use FlatList (built-in virtualization)

```typescript
// ❌ BAD - Renders all items
<ScrollView>
  {pathkeys.map(pathkey => (
    <PathkeyCard key={pathkey.id} pathkey={pathkey} />
  ))}
</ScrollView>

// ✅ GOOD - Only renders visible items
<FlatList
  data={pathkeys}
  renderItem={({ item }) => <PathkeyCard pathkey={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### 6.2 Image Optimization

```typescript
// Use FastImage for better performance
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: pathkey.image_url,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.contain}
/>

// Preload images for smoother UX
FastImage.preload([
  { uri: pathkey1.image_url },
  { uri: pathkey2.image_url },
]);
```

### 6.3 Animation Performance

```typescript
// Use react-native-reanimated for 60fps animations
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const PathkeyCard = ({ pathkey }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress}>
        {/* Content */}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### 6.4 Code Splitting & Lazy Loading

```typescript
// Lazy load screens
import { lazy, Suspense } from 'react';

const GameScreen = lazy(() => import('./screens/GameScreen'));
const PathkeysScreen = lazy(() => import('./screens/PathkeysScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Stack.Navigator>
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Pathkeys" component={PathkeysScreen} />
      </Stack.Navigator>
    </Suspense>
  );
}
```

### 6.5 Memory Management

```typescript
// Clean up subscriptions and timers
useEffect(() => {
  const subscription = supabase
    .channel('game_players')
    .on('INSERT', handlePlayerJoin)
    .subscribe();
  
  const timer = setInterval(updateTime, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);

// Implement pagination for large datasets
const [pathkeys, setPathkeys] = useState([]);
const [page, setPage] = useState(1);
const PAGE_SIZE = 20;

const loadMore = async () => {
  const { data } = await supabase
    .from('pathkeys')
    .select('*')
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  
  setPathkeys([...pathkeys, ...data]);
  setPage(page + 1);
};
```

---

## 7. APP STORE PREPARATION

### 7.1 iOS App Store (Apple)

**Requirements:**

1. **Apple Developer Account**
   - Cost: $99/year
   - Entity type: Individual or Organization
   - Set up at: developer.apple.com

2. **App Store Connect**
   - Create app listing
   - Upload app icon (1024x1024)
   - Screenshots (all required sizes)
   - App description
   - Keywords for search
   - Privacy policy URL
   - Support URL

3. **Privacy Manifest**
   ```xml
   <!-- ios/Pathcte/PrivacyInfo.xcprivacy -->
   <key>NSPrivacyTracking</key>
   <false/>
   <key>NSPrivacyTrackingDomains</key>
   <array/>
   <key>NSPrivacyCollectedDataTypes</key>
   <array>
     <dict>
       <key>NSPrivacyCollectedDataType</key>
       <string>NSPrivacyCollectedDataTypeEmailAddress</string>
       <key>NSPrivacyCollectedDataTypeLinked</key>
       <true/>
       <key>NSPrivacyCollectedDataTypePurposes</key>
       <array>
         <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
       </array>
     </dict>
   </array>
   ```

4. **App Store Screenshots**
   Required sizes:
   - iPhone 6.7" (1290 x 2796) - 3 required
   - iPhone 6.5" (1242 x 2688) - 3 required  
   - iPhone 5.5" (1242 x 2208) - 3 required
   - iPad Pro 12.9" (2048 x 2732) - 3 required

5. **App Preview Video** (optional but recommended)
   - 15-30 seconds
   - Showcase key features
   - No audio required (subtitles)

6. **TestFlight Beta**
   - Internal testing (up to 100 users)
   - External testing (up to 10,000 users)
   - Get feedback before launch

### 7.2 Google Play Store (Android)

**Requirements:**

1. **Google Play Console Account**
   - One-time fee: $25
   - Register at: play.google.com/console

2. **App Listing**
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (phone & tablet)
   - App description (4000 chars max)
   - Short description (80 chars max)
   - Privacy policy URL

3. **Content Rating**
   - Fill out questionnaire
   - Pathcte likely: E for Everyone or E10+
   - Complete rating for each region

4. **Data Safety Section**
   ```
   Data collected:
   - Email address (account creation)
   - Name (profile)
   - Game performance data (analytics)
   
   Data shared:
   - None (all data stays in your system)
   
   Security practices:
   - Data encrypted in transit
   - Data encrypted at rest
   - Users can request deletion
   ```

5. **Screenshots**
   Required:
   - 2-8 phone screenshots (16:9 or 9:16)
   - Minimum 2 for 7" tablets
   - Minimum 2 for 10" tablets

6. **Internal Testing Track**
   - Up to 100 testers
   - Instant updates
   - Feedback collection

### 7.3 App Store Optimization (ASO)

**App Name:**
- "Pathcte - Career Exploration Game"
- "Pathcte: Learn Through Play"
- Max 30 characters (iOS), 50 (Android)

**Keywords (iOS):**
```
career, education, learning game, pathfinder, careers, 
students, teachers, quiz, educational games, STEM, 
job exploration, future planning, college prep
```

**Description Template:**
```
🔑 Discover Your Future with Pathcte!

Pathcte makes career exploration fun through interactive games. 
Students collect "Pathkeys" while learning about hundreds of careers, 
building skills, and planning their futures.

✨ KEY FEATURES:
• Unlock 1000+ career paths
• Play 20+ educational game modes
• Complete homework assignments
• Track your progress
• Explore careers with Finn, your AI guide

👨‍🎓 FOR STUDENTS:
• Join games instantly with a code
• Collect rare Pathkeys
• Learn about careers that match your interests
• Earn tokens and unlock rewards

👩‍🏫 FOR TEACHERS:
• Create custom question sets
• Host live games for your class
• Assign homework
• Track student progress
• Support career readiness

🎮 GAME MODES:
Career Quest, Path Defense, Career Clash, and many more!

📱 100% FREE for students
💎 Premium features for teachers

Download Pathcte today and start unlocking your future! 🚀
```

### 7.4 App Store Assets Checklist

**iOS:**
- [ ] App icon (1024x1024, PNG, no transparency)
- [ ] 6.7" iPhone screenshots (3-10)
- [ ] 6.5" iPhone screenshots (3-10)
- [ ] 5.5" iPhone screenshots (3-10)
- [ ] 12.9" iPad screenshots (3-10)
- [ ] App preview video (optional, 15-30 sec)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] App description (4000 chars)
- [ ] Keywords (100 chars)
- [ ] What's new (4000 chars)

**Android:**
- [ ] App icon (512x512, PNG)
- [ ] Feature graphic (1024x500, JPG/PNG)
- [ ] Phone screenshots (2-8, 16:9 or 9:16)
- [ ] 7" tablet screenshots (2-8)
- [ ] 10" tablet screenshots (2-8)
- [ ] Promotional video URL (YouTube, optional)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Website URL
- [ ] Email address
- [ ] Phone number (optional)

---

## 8. TESTING STRATEGY

### 8.1 Unit Testing (Shared Code)

```typescript
// packages/shared/__tests__/services/auth.service.test.ts

import { authService } from '../../src/services/auth.service';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const mockData = { user: { id: '123', email: 'test@test.com' } };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      });
      
      const result = await authService.signIn('test@test.com', 'password123');
      
      expect(result.user).toEqual(mockData.user);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
    
    it('should throw error with invalid credentials', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });
      
      await expect(
        authService.signIn('test@test.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### 8.2 Component Testing (Mobile)

```typescript
// packages/mobile/__tests__/components/Button.test.tsx

import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button onPress={() => {}} title="Test Button" />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} title="Test Button" />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} title="Test Button" disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### 8.3 E2E Testing (Detox)

```typescript
// e2e/login.test.ts

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.text('Dashboard'))).toBeVisible();
  });
  
  it('should show error with invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@example.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});
```

### 8.4 Beta Testing Strategy

**Phase 1: Internal Alpha (1-2 weeks)**
- Development team only
- Test all core features
- Fix critical bugs
- Performance testing

**Phase 2: Private Beta (2-3 weeks)**
- 20-30 teachers and students
- TestFlight (iOS) + Internal Track (Android)
- Collect structured feedback
- Focus on:
  - Usability issues
  - Confusing UI
  - Missing features
  - Performance problems

**Phase 3: Public Beta (3-4 weeks)**
- 100-500 users
- Open beta via TestFlight + Play Console
- Monitor analytics
- Crash reporting
- User reviews
- Iterate quickly

**Feedback Collection:**
```typescript
// In-app feedback
import * as MailComposer from 'expo-mail-composer';

const sendFeedback = async () => {
  const isAvailable = await MailComposer.isAvailableAsync();
  
  if (isAvailable) {
    await MailComposer.composeAsync({
      recipients: ['feedback@pathcte.app'],
      subject: 'Pathcte Beta Feedback',
      body: `
        App Version: ${Constants.manifest.version}
        Platform: ${Platform.OS} ${Platform.Version}
        Device: ${Device.modelName}
        
        Feedback:
      `,
    });
  }
};
```

---

## 9. DEPLOYMENT PIPELINE

### 9.1 EAS Build (Expo Application Services)

**Setup:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Run first build
eas build --platform ios
eas build --platform android
```

**eas.json Configuration:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD1234"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 9.2 CI/CD with GitHub Actions

```yaml
# .github/workflows/mobile-deploy.yml

name: Mobile App Deploy

on:
  push:
    branches: [main]
    paths:
      - 'packages/mobile/**'
      - 'packages/shared/**'

jobs:
  build-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
        working-directory: packages/mobile
      
      - name: Build iOS
        run: eas build --platform ios --non-interactive --no-wait
        working-directory: packages/mobile
  
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
        working-directory: packages/mobile
      
      - name: Build Android
        run: eas build --platform android --non-interactive --no-wait
        working-directory: packages/mobile
  
  deploy:
    needs: [build-ios, build-android]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Submit to App Stores
        run: |
          eas submit --platform ios --latest
          eas submit --platform android --latest
        working-directory: packages/mobile
```

### 9.3 Over-The-Air (OTA) Updates

**Advantage:** Fix bugs without app store review

```bash
# Publish update
eas update --branch production --message "Fix login bug"

# Automatic rollout
eas update:configure
```

**Update Strategy:**
```typescript
// packages/mobile/App.tsx
import * as Updates from 'expo-updates';

useEffect(() => {
  async function checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }
  
  checkForUpdates();
}, []);
```

**What can be updated OTA:**
- JavaScript code changes
- React component updates
- Bug fixes
- UI tweaks
- Content updates

**What requires new build:**
- Native module changes
- Expo SDK upgrades
- app.json changes
- New permissions

---

## 10. MAINTENANCE STRATEGY

### 10.1 Version Management

**Semantic Versioning:**
```
v1.0.0 - Initial release
v1.0.1 - Bug fix (OTA update)
v1.1.0 - New feature (minor release)
v2.0.0 - Breaking changes (major release)
```

**Release Schedule:**
- **Patch releases (1.0.x):** Weekly OTA updates for bugs
- **Minor releases (1.x.0):** Monthly for new features
- **Major releases (x.0.0):** Quarterly or as needed

### 10.2 Monitoring & Analytics

```typescript
// packages/mobile/src/services/monitoring.service.ts
import * as Sentry from 'sentry-expo';
import * as Analytics from 'expo-firebase-analytics';

export const monitoringService = {
  init() {
    Sentry.init({
      dsn: 'your-sentry-dsn',
      enableInExpoDevelopment: false,
      debug: __DEV__,
    });
  },
  
  logError(error: Error, context?: Record<string, any>) {
    Sentry.Native.captureException(error, { extra: context });
  },
  
  logEvent(eventName: string, properties?: Record<string, any>) {
    Analytics.logEvent(eventName, properties);
  },
  
  setUser(userId: string) {
    Sentry.Native.setUser({ id: userId });
  },
};

// Track key events
monitoringService.logEvent('game_joined', {
  game_mode: 'career_quest',
  player_count: 24,
});

monitoringService.logEvent('pathkey_unlocked', {
  pathkey_rarity: 'legendary',
  pathkey_name: 'Astronaut',
});
```

### 10.3 Crash Reporting

```typescript
// Automatic crash reporting
Sentry.Native.captureException(new Error('Test error'));

// Add context to crashes
Sentry.Native.setContext('game_state', {
  game_mode: 'career_quest',
  current_question: 5,
  players: 12,
});

// Breadcrumb trail
Sentry.Native.addBreadcrumb({
  message: 'User joined game',
  category: 'navigation',
  level: 'info',
});
```

### 10.4 Performance Monitoring

```typescript
// Track screen load times
const startTime = performance.now();

useEffect(() => {
  const loadTime = performance.now() - startTime;
  
  Analytics.logEvent('screen_load_time', {
    screen_name: 'Dashboard',
    load_time_ms: loadTime,
  });
}, []);

// Monitor API response times
const fetchWithTiming = async (endpoint: string) => {
  const start = performance.now();
  
  try {
    const response = await fetch(endpoint);
    const duration = performance.now() - start;
    
    Analytics.logEvent('api_response_time', {
      endpoint,
      duration_ms: duration,
      status: response.status,
    });
    
    return response;
  } catch (error) {
    const duration = performance.now() - start;
    
    Analytics.logEvent('api_error', {
      endpoint,
      duration_ms: duration,
      error: error.message,
    });
    
    throw error;
  }
};
```

### 10.5 User Feedback Loop

```typescript
// In-app rating prompt
import * as StoreReview from 'expo-store-review';

export const requestReview = async () => {
  const isAvailable = await StoreReview.isAvailableAsync();
  
  if (isAvailable) {
    await StoreReview.requestReview();
  }
};

// Trigger after positive experiences
// - Completed 5 games
// - Unlocked 10 pathkeys
// - Used app 7 days in a row
```

### 10.6 Update Communication

**In-App Changelog:**
```typescript
const CHANGELOG = {
  '1.1.0': {
    date: '2025-02-01',
    features: [
      'New game mode: Career Kingdom',
      'Push notifications for homework reminders',
      'Improved pathkey animations',
    ],
    fixes: [
      'Fixed crash when joining game',
      'Improved performance on older devices',
    ],
  },
};

// Show on first launch after update
const showChangelog = () => {
  const currentVersion = Constants.manifest.version;
  const lastSeenVersion = await AsyncStorage.getItem('last_seen_version');
  
  if (currentVersion !== lastSeenVersion) {
    // Show changelog modal
    setShowChangelogModal(true);
    await AsyncStorage.setItem('last_seen_version', currentVersion);
  }
};
```

---

## APPENDIX A: Technology Comparison

### Web vs Mobile Feature Parity

| Feature | Web | iOS | Android | Notes |
|---------|-----|-----|---------|-------|
| **Authentication** | ✅ | ✅ | ✅ | Email, Google OAuth |
| **Live Games** | ✅ | ✅ | ✅ | Real-time via Supabase |
| **Homework** | ✅ | ✅ | ✅ | Full feature parity |
| **Pathkey Collection** | ✅ | ✅ | ✅ | Same mechanics |
| **Career Exploration** | ✅ | ✅ | ✅ | Same content |
| **Market** | ✅ | ✅ | ✅ | Token purchases |
| **Push Notifications** | ❌ | ✅ | ✅ | Mobile only |
| **Biometrics** | ⚠️ | ✅ | ✅ | WebAuthn on web |
| **Haptic Feedback** | ⚠️ | ✅ | ✅ | Limited on web |
| **Camera** | ⚠️ | ✅ | ✅ | Limited on web |
| **Offline Mode** | ⚠️ | ✅ | ✅ | Better on mobile |
| **Share Features** | ⚠️ | ✅ | ✅ | Better on mobile |

---

## APPENDIX B: Mobile Development Checklist

### Pre-Development
- [ ] Review mobile-first implementation guide
- [ ] Ensure all shared code is platform-agnostic
- [ ] Design system tokens defined
- [ ] API layer complete and tested
- [ ] Database optimized for mobile (indices, RLS)

### Setup Phase
- [ ] Initialize React Native with Expo
- [ ] Configure monorepo (workspaces)
- [ ] Set up TypeScript paths
- [ ] Configure ESLint/Prettier
- [ ] Set up CI/CD pipeline
- [ ] Create Apple Developer account
- [ ] Create Google Play Console account

### Development Phase
- [ ] Implement navigation (React Navigation)
- [ ] Build core UI components
- [ ] Port authentication screens
- [ ] Port student dashboard
- [ ] Port teacher dashboard
- [ ] Implement game modes
- [ ] Add push notifications
- [ ] Add biometric auth
- [ ] Implement haptic feedback
- [ ] Add camera integration
- [ ] Implement share functionality

### Testing Phase
- [ ] Unit tests for shared code
- [ ] Component tests for mobile UI
- [ ] E2E tests (Detox)
- [ ] Manual testing on iOS devices
- [ ] Manual testing on Android devices
- [ ] TestFlight beta (iOS)
- [ ] Internal track beta (Android)
- [ ] Performance testing
- [ ] Load testing

### Launch Phase
- [ ] Create app store listings
- [ ] Prepare screenshots (all sizes)
- [ ] Write app descriptions
- [ ] Set up analytics
- [ ] Set up crash reporting
- [ ] Create privacy policy
- [ ] Submit for review
- [ ] Monitor initial reviews
- [ ] Fix critical issues quickly

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track key metrics
- [ ] Collect user feedback
- [ ] Plan regular updates
- [ ] Set up OTA update pipeline
- [ ] Maintain 4+ star rating

---

## APPENDIX C: Useful Resources

**Documentation:**
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Supabase React Native: https://supabase.com/docs/guides/getting-started/tutorials/with-react-native

**Tools:**
- Expo EAS: https://expo.dev/eas
- React Native Debugger: https://github.com/jhen0409/react-native-debugger
- Flipper: https://fbflipper.com
- Detox (E2E testing): https://github.com/wix/Detox

**App Store Guidelines:**
- iOS App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policy Center: https://play.google.com/about/developer-content-policy/

**Communities:**
- React Native Discord
- Expo Discord
- /r/reactnative
- Stack Overflow

---

**Document Version:** 1.0  
**Last Updated:** October 27, 2025  
**Status:** Mobile Strategy Complete  
**Next Steps:** Build web version with mobile-first principles, then execute mobile development timeline

---

*With this strategy, Pathcte will have native iOS and Android apps within 4 months of web launch, sharing 70% of code and providing a consistent experience across all platforms.* 📱✨
