# PATHCTE IMPLEMENTATION GUIDE FOR CLAUDE CODE

## Project Overview

**Project Name:** Pathcte
**Tech Stack:** React.js + TypeScript + Supabase + Netlify + Azure Storage
**Purpose:** Career-focused educational gaming platform with Pathkeys collection system
**Development Approach:** Phased implementation with Claude Code AI assistance

---

## 📊 IMPLEMENTATION STATUS (Updated: October 27, 2025)

### Overall Progress: 35-40% Complete

| Phase | Status | Completion | Priority |
|-------|--------|-----------|----------|
| **Phase 1: Foundation & Auth** | ✅ Complete | 100% | Critical |
| **Phase 2: Core Infrastructure** | ✅ Mostly Complete | 90% | Critical |
| **Phase 3: Pathkeys & Careers** | ✅ UI Complete | 85% | High |
| **Phase 4: Question Set Manager** | ❌ Not Started | 0% | Critical |
| **Phase 5: Live Game System** | ✅ Complete | 100% | Critical |
| **Phase 6: Additional Game Modes** | ⚠️ Design Only | 5% | Medium |
| **Phase 7: Homework & Analytics** | ❌ Not Started | 0% | High |
| **Phase 8: Marketplace UI** | ❌ Not Started | 0% | Medium |
| **Phase 9: Polish & Launch Prep** | ❌ Not Started | 0% | High |

### What's Working Now ✅

**Core Platform (Production Ready)**
- ✅ User authentication (login, signup, logout, session management)
- ✅ Complete database schema with 14 tables + RLS policies
- ✅ Real-time multiplayer system with WebSocket sync
- ✅ UI component library with 25+ reusable components
- ✅ Responsive design with light/dark theme toggle
- ✅ State management (Auth, Game, UI stores)

**Student Experience (Functional MVP)**
- ✅ Join live games with 6-character codes
- ✅ Real-time lobby with player list and ready indicators
- ✅ Question answering with timer and auto-scoring
- ✅ Live leaderboard with rankings and accuracy
- ✅ Token rewards and placement calculation
- ✅ Career browsing with 500+ O*NET careers
- ✅ Pathkey collection viewing with rarity filtering
- ✅ Dashboard with stats (tokens, pathkeys, games played)

**Teacher Experience (Basic Hosting)**
- ✅ Create live games with mode selection
- ✅ Generate game codes for student joining
- ✅ Control game flow (start, next question, end)
- ✅ View real-time player participation

### What's Missing ❌

**Critical Gaps (Blocks Launch)**
1. ❌ **Question Set Creation UI** - Teachers can't create custom content
2. ❌ **Homework Assignment System** - No async assignments
3. ❌ **Teacher Analytics Dashboard** - No student progress reports

**High Priority (Post-Launch Essential)**
4. ❌ **Marketplace UI** - Can't browse/purchase pathkey packs (DB ready)
5. ❌ **13 Additional Game Modes** - Only basic quiz mode implemented
6. ❌ **Advanced Game Reports** - Limited post-game analytics

**Medium Priority (Feature Enhancement)**
7. ❌ **Power-ups in Gameplay** - Designed but not implemented
8. ❌ **Finn AI Assistant** - Career guidance chatbot
9. ❌ **Achievement Animations** - Pathkey unlock effects
10. ❌ **Social Features** - Friends, teams, trading

### Design vs Implementation Alignment

**✅ Fully Aligned with Design Document**
- Pathkey system (5 rarity tiers: common→legendary)
- Career exploration mechanics with O*NET data
- Token economy (earning through correct answers)
- Live multiplayer architecture
- Database schema supports all planned features

**⚠️ Partially Aligned**
- Game modes: 6 defined in DB, only 1 UI implemented (need 13 more)
- Marketplace: Complete DB schema, zero UI
- Analytics: Event tracking DB ready, dashboard not built

**❌ Not Yet Started**
- Teacher content creation tools
- Homework system
- Advanced game mode implementations (Tower Defense, Racing, etc.)
- Finn AI integration

### Technical Debt & Quality

**Strengths**
- ✅ Full TypeScript with strict mode
- ✅ Clean separation: services, components, stores
- ✅ Proper package structure (shared/web for future mobile)
- ✅ RLS policies on all database tables
- ✅ Real-time system with Supabase subscriptions

**Needs Improvement**
- ⚠️ No test coverage yet (0%)
- ⚠️ React Query not integrated (using custom hooks)
- ⚠️ Limited error boundaries
- ⚠️ Animation/transition polish needed
- ⚠️ Performance optimization not done

---

## TABLE OF CONTENTS

1. [Technology Stack Details](#1-technology-stack-details)
2. [Project Architecture](#2-project-architecture)
3. [Database Schema (Supabase)](#3-database-schema-supabase)
4. [File Structure](#4-file-structure)
5. [Environment Configuration](#5-environment-configuration)
6. [Implementation Phases](#6-implementation-phases)
7. [Component Specifications](#7-component-specifications)
8. [API Endpoints & Functions](#8-api-endpoints--functions)
9. [State Management](#9-state-management)
10. [Authentication Flow](#10-authentication-flow)
11. [Game Engine Architecture](#11-game-engine-architecture)
12. [Azure Storage Integration](#12-azure-storage-integration)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Pipeline](#14-deployment-pipeline)
15. [Performance Optimization](#15-performance-optimization)
16. [Security Considerations](#16-security-considerations)
17. [Development Workflow](#17-development-workflow)

---

## 1. TECHNOLOGY STACK DETAILS

### 1.1 Core Technologies

> **🎯 MOBILE-FIRST DESIGN PHILOSOPHY**
> 
> This implementation is architected with native mobile apps in mind from day one. Key decisions:
> - **API-first architecture**: All business logic in backend/services layer
> - **Shared component library**: Design system works across web and React Native
> - **Platform-agnostic state**: Zustand works identically in React Native
> - **Responsive by default**: Mobile-first CSS with Tailwind
> - **Touch-optimized**: All interactions designed for touch screens
> - **Offline-capable**: Service workers + local storage strategy

**Frontend Framework:**
```
React 18.2+ with TypeScript 5.0+
- Hooks-based functional components (100% compatible with React Native)
- React Router v6 for routing (web) / React Navigation (mobile)
- Context API + Custom hooks for state management (cross-platform)
- NO platform-specific browser APIs in business logic
```

**Database & Backend:**
```
Supabase (PostgreSQL + Real-time + Auth + Storage)
- PostgreSQL 15+ for relational data
- Row Level Security (RLS) policies
- Real-time subscriptions for live games
- Supabase Auth for user management
- Supabase Storage for game assets (alternative to Azure)
```

**Hosting & Deployment:**
```
Netlify
- Continuous deployment from Git
- Serverless functions for API routes
- CDN for static assets
- Environment variable management
```

**Asset Storage:**
```
Microsoft Azure Blob Storage
- Career images and videos
- Pathkey artwork
- User-uploaded content
- CDN integration for fast delivery
```

### 1.2 Supporting Libraries

**UI & Styling:**
```json
{
  "tailwindcss": "^3.3.0",
  "@headlessui/react": "^1.7.0",
  "framer-motion": "^10.0.0",
  "react-icons": "^4.12.0",
  "lucide-react": "^0.263.0"
}
```

**Game Development:**
```json
{
  "phaser": "^3.60.0",
  "react-konva": "^18.2.0",
  "konva": "^9.2.0",
  "howler": "^2.2.3"
}
```

**Data & API:**
```json
{
  "@supabase/supabase-js": "^2.38.0",
  "axios": "^1.6.0",
  "react-query": "^3.39.0",
  "@azure/storage-blob": "^12.17.0"
}
```

**Utilities:**
```json
{
  "date-fns": "^2.30.0",
  "uuid": "^9.0.0",
  "zod": "^3.22.0",
  "zustand": "^4.4.0",
  "immer": "^10.0.0"
}
```

**Development:**
```json
{
  "vite": "^5.0.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "eslint": "^8.54.0",
  "prettier": "^3.1.0",
  "typescript": "^5.3.0"
}
```

---

## 2. PROJECT ARCHITECTURE

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        React + TypeScript Application (Netlify)        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │   Auth   │  │   Game   │  │  Teacher Dashboard   │ │ │
│  │  │  Module  │  │  Engine  │  │      Module          │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                          │
│  ┌──────────────────────┐      ┌──────────────────────────┐ │
│  │   Supabase Backend   │      │   Netlify Functions      │ │
│  │  ┌────────────────┐  │      │  ┌────────────────────┐ │ │
│  │  │  PostgreSQL DB │  │      │  │   API Routes       │ │ │
│  │  ├────────────────┤  │      │  ├────────────────────┤ │ │
│  │  │  Auth Service  │  │      │  │  Business Logic    │ │ │
│  │  ├────────────────┤  │      │  ├────────────────────┤ │ │
│  │  │  Real-time WS  │  │      │  │  Integrations      │ │ │
│  │  ├────────────────┤  │      │  └────────────────────┘ │ │
│  │  │  Edge Fncs     │  │      └──────────────────────────┘ │
│  │  └────────────────┘  │                                    │
│  └──────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE TIER                             │
│  ┌──────────────────────┐      ┌──────────────────────────┐ │
│  │  Supabase Storage    │      │  Azure Blob Storage      │ │
│  │  ┌────────────────┐  │      │  ┌────────────────────┐ │ │
│  │  │ User Uploads   │  │      │  │  Career Content    │ │ │
│  │  ├────────────────┤  │      │  ├────────────────────┤ │ │
│  │  │ Game Assets    │  │      │  │  Pathkey Images    │ │ │
│  │  ├────────────────┤  │      │  ├────────────────────┤ │ │
│  │  │ Avatars        │  │      │  │  Videos            │ │ │
│  │  └────────────────┘  │      │  └────────────────────┘ │ │
│  └──────────────────────┘      └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Architecture

```
USER ACTION (Click/Input)
    ↓
REACT COMPONENT
    ↓
STATE MANAGEMENT (Zustand/Context)
    ↓
API CALL (React Query)
    ↓
SUPABASE CLIENT / NETLIFY FUNCTION
    ↓
SUPABASE POSTGRES + RLS POLICIES
    ↓
RESPONSE + REAL-TIME UPDATES
    ↓
UI UPDATE (Re-render)
```

---

## 3. DATABASE SCHEMA (SUPABASE)

### 3.1 Core Tables

#### `users` (extends Supabase auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'parent')),
  username TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Student specific
  grade_level INTEGER,
  school_id UUID REFERENCES schools(id),
  
  -- Teacher specific
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'plus', 'flex')),
  subscription_expires_at TIMESTAMPTZ,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_-]{3,20}$')
);

-- Indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### `schools`
```sql
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  license_type TEXT CHECK (license_type IN ('free', 'school', 'district')),
  max_students INTEGER,
  max_teachers INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_name ON schools(name);
```

#### `pathkeys`
```sql
CREATE TABLE public.pathkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  key_type TEXT NOT NULL CHECK (key_type IN ('career', 'skill', 'industry', 'milestone', 'mystery')),
  
  -- Career specific (if key_type = 'career')
  career_id UUID REFERENCES careers(id),
  
  -- Visual
  image_url TEXT NOT NULL,
  image_url_animated TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  release_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pathkeys_rarity ON pathkeys(rarity);
CREATE INDEX idx_pathkeys_key_type ON pathkeys(key_type);
CREATE INDEX idx_pathkeys_career_id ON pathkeys(career_id);
CREATE INDEX idx_pathkeys_key_code ON pathkeys(key_code);
```

#### `user_pathkeys`
```sql
CREATE TABLE public.user_pathkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pathkey_id UUID NOT NULL REFERENCES pathkeys(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  quantity INTEGER DEFAULT 1,
  is_favorite BOOLEAN DEFAULT false,
  
  UNIQUE(user_id, pathkey_id)
);

CREATE INDEX idx_user_pathkeys_user_id ON user_pathkeys(user_id);
CREATE INDEX idx_user_pathkeys_pathkey_id ON user_pathkeys(pathkey_id);

-- RLS
ALTER TABLE user_pathkeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pathkeys"
  ON user_pathkeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pathkeys"
  ON user_pathkeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pathkeys"
  ON user_pathkeys FOR UPDATE
  USING (auth.uid() = user_id);
```

#### `careers`
```sql
CREATE TABLE public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onet_code TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Classification
  industry TEXT NOT NULL,
  sector TEXT NOT NULL,
  career_cluster TEXT,
  
  -- Requirements
  education_level TEXT[],
  certifications TEXT[],
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_median INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  
  -- Job Market
  growth_rate DECIMAL,
  job_outlook TEXT,
  employment_2023 INTEGER,
  employment_2033_projected INTEGER,
  
  -- Content
  day_in_life_text TEXT,
  video_url TEXT,
  tasks TEXT[],
  work_environment TEXT,
  
  -- Related
  related_careers UUID[],
  
  -- Metadata
  content_last_updated DATE,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_careers_onet_code ON careers(onet_code);
CREATE INDEX idx_careers_industry ON careers(industry);
CREATE INDEX idx_careers_sector ON careers(sector);
CREATE INDEX idx_careers_title ON careers(title);
CREATE INDEX idx_careers_title_search ON careers USING gin(to_tsvector('english', title));
```

#### `question_sets`
```sql
CREATE TABLE public.question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Classification
  subject TEXT NOT NULL,
  grade_level INTEGER[],
  career_sector TEXT,
  tags TEXT[],
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Stats
  times_played INTEGER DEFAULT 0,
  average_score DECIMAL,
  total_questions INTEGER DEFAULT 0,
  
  -- Metadata
  thumbnail_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'mixed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_question_sets_creator_id ON question_sets(creator_id);
CREATE INDEX idx_question_sets_subject ON question_sets(subject);
CREATE INDEX idx_question_sets_is_public ON question_sets(is_public);
CREATE INDEX idx_question_sets_title_search ON question_sets USING gin(to_tsvector('english', title));

-- RLS
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public sets viewable by all"
  ON question_sets FOR SELECT
  USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Teachers can create sets"
  ON question_sets FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

CREATE POLICY "Creators can update own sets"
  ON question_sets FOR UPDATE
  USING (auth.uid() = creator_id);
```

#### `questions`
```sql
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false')),
  
  -- Options
  options JSONB NOT NULL, -- Array of {text: string, is_correct: boolean}
  
  -- Settings
  time_limit_seconds INTEGER DEFAULT 30,
  points INTEGER DEFAULT 10,
  
  -- Media
  image_url TEXT,
  
  -- Metadata
  order_index INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_question_set_id ON questions(question_set_id);
CREATE INDEX idx_questions_order_index ON questions(question_set_id, order_index);

-- RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions viewable with question set"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM question_sets qs
      WHERE qs.id = question_set_id
      AND (qs.is_public = true OR qs.creator_id = auth.uid())
    )
  );

CREATE POLICY "Set creators can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM question_sets qs
      WHERE qs.id = question_set_id AND qs.creator_id = auth.uid()
    )
  );
```

#### `game_sessions`
```sql
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code TEXT UNIQUE NOT NULL,
  
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_set_id UUID NOT NULL REFERENCES question_sets(id),
  
  game_mode TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')),
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb, -- Game-specific settings
  max_players INTEGER DEFAULT 60,
  
  -- Timing
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Results
  total_players INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_sessions_game_code ON game_sessions(game_code);
CREATE INDEX idx_game_sessions_host_id ON game_sessions(host_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at);

-- RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game sessions viewable by host and players"
  ON game_sessions FOR SELECT
  USING (
    auth.uid() = host_id OR
    EXISTS (SELECT 1 FROM game_players WHERE game_session_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Teachers can create game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );
```

#### `game_players`
```sql
CREATE TABLE public.game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  display_name TEXT NOT NULL,
  
  -- Score tracking
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  
  -- Status
  is_connected BOOLEAN DEFAULT true,
  placement INTEGER,
  
  -- Rewards
  tokens_earned INTEGER DEFAULT 0,
  pathkeys_earned UUID[],
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  
  UNIQUE(game_session_id, user_id),
  UNIQUE(game_session_id, display_name)
);

CREATE INDEX idx_game_players_game_session_id ON game_players(game_session_id);
CREATE INDEX idx_game_players_user_id ON game_players(user_id);
CREATE INDEX idx_game_players_score ON game_players(game_session_id, score DESC);

-- RLS
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game players viewable by session participants"
  ON game_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions gs
      WHERE gs.id = game_session_id
      AND (gs.host_id = auth.uid() OR EXISTS (
        SELECT 1 FROM game_players gp2
        WHERE gp2.game_session_id = gs.id AND gp2.user_id = auth.uid()
      ))
    )
  );
```

#### `game_answers`
```sql
CREATE TABLE public.game_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  game_player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  
  answer_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_answers_game_session_id ON game_answers(game_session_id);
CREATE INDEX idx_game_answers_game_player_id ON game_answers(game_player_id);
CREATE INDEX idx_game_answers_question_id ON game_answers(question_id);

-- RLS
ALTER TABLE game_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game answers viewable by host and player"
  ON game_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions gs
      WHERE gs.id = game_session_id AND gs.host_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM game_players gp
      WHERE gp.id = game_player_id AND gp.user_id = auth.uid()
    )
  );
```

#### `homework_assignments`
```sql
CREATE TABLE public.homework_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_set_id UUID NOT NULL REFERENCES question_sets(id),
  
  title TEXT NOT NULL,
  description TEXT,
  
  game_mode TEXT NOT NULL,
  completion_goal JSONB NOT NULL, -- Goal specific to game mode
  
  -- Timing
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ NOT NULL,
  
  -- Access
  access_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_homework_assignments_teacher_id ON homework_assignments(teacher_id);
CREATE INDEX idx_homework_assignments_access_code ON homework_assignments(access_code);
CREATE INDEX idx_homework_assignments_due_at ON homework_assignments(due_at);

-- RLS
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own assignments"
  ON homework_assignments FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments"
  ON homework_assignments FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);
```

#### `homework_submissions`
```sql
CREATE TABLE public.homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_assignment_id UUID NOT NULL REFERENCES homework_assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  display_name TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  
  -- Results
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  goal_achieved BOOLEAN DEFAULT false,
  
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  
  -- Rewards
  tokens_earned INTEGER DEFAULT 0,
  pathkeys_earned UUID[],
  
  -- Data
  game_data JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(homework_assignment_id, student_id)
);

CREATE INDEX idx_homework_submissions_assignment_id ON homework_submissions(homework_assignment_id);
CREATE INDEX idx_homework_submissions_student_id ON homework_submissions(student_id);
CREATE INDEX idx_homework_submissions_status ON homework_submissions(status);

-- RLS
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
  ON homework_submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view assignment submissions"
  ON homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework_assignments ha
      WHERE ha.id = homework_assignment_id AND ha.teacher_id = auth.uid()
    )
  );
```

#### `user_achievements`
```sql
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  
  -- Progress
  progress INTEGER DEFAULT 0,
  goal INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  
  -- Rewards
  tokens_reward INTEGER,
  pathkey_reward UUID REFERENCES pathkeys(id),
  
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_type, achievement_name)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_is_completed ON user_achievements(is_completed);
```

#### `market_items`
```sql
CREATE TABLE public.market_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  item_type TEXT NOT NULL CHECK (item_type IN ('key_pack', 'profile_item', 'power_up', 'special')),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  token_cost INTEGER NOT NULL,
  
  -- Contents (for key packs)
  contents JSONB DEFAULT '[]'::jsonb,
  
  -- Visual
  image_url TEXT,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_from DATE,
  available_until DATE,
  
  -- Limits
  purchase_limit INTEGER, -- NULL = unlimited
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_items_item_type ON market_items(item_type);
CREATE INDEX idx_market_items_is_available ON market_items(is_available);
CREATE INDEX idx_market_items_is_featured ON market_items(is_featured);
```

#### `user_purchases`
```sql
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  market_item_id UUID NOT NULL REFERENCES market_items(id),
  
  tokens_spent INTEGER NOT NULL,
  items_received JSONB DEFAULT '[]'::jsonb,
  
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX idx_user_purchases_purchased_at ON user_purchases(purchased_at);
```

#### `analytics_events`
```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  
  properties JSONB DEFAULT '{}'::jsonb,
  
  session_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

### 3.2 Database Functions

#### Generate Game Code
```sql
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### Award Pathkey to User
```sql
CREATE OR REPLACE FUNCTION award_pathkey(
  p_user_id UUID,
  p_pathkey_id UUID
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_pathkeys (user_id, pathkey_id, quantity)
  VALUES (p_user_id, p_pathkey_id, 1)
  ON CONFLICT (user_id, pathkey_id)
  DO UPDATE SET quantity = user_pathkeys.quantity + 1;
END;
$$ LANGUAGE plpgsql;
```

#### Award Tokens to User
```sql
CREATE OR REPLACE FUNCTION award_tokens(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET tokens = tokens + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

#### Calculate Player Placement
```sql
CREATE OR REPLACE FUNCTION calculate_player_placement(
  p_game_session_id UUID
)
RETURNS void AS $$
BEGIN
  WITH ranked_players AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC, correct_answers DESC, joined_at ASC) as rank
    FROM game_players
    WHERE game_session_id = p_game_session_id
  )
  UPDATE game_players gp
  SET placement = rp.rank
  FROM ranked_players rp
  WHERE gp.id = rp.id;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Triggers

#### Update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Repeat for other tables...
```

#### Update Question Count
```sql
CREATE OR REPLACE FUNCTION update_question_set_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE question_sets
    SET total_questions = total_questions + 1
    WHERE id = NEW.question_set_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE question_sets
    SET total_questions = total_questions - 1
    WHERE id = OLD.question_set_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_count_on_insert
  AFTER INSERT ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_set_count();

CREATE TRIGGER update_question_count_on_delete
  AFTER DELETE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_set_count();
```

---

## 4. FILE STRUCTURE

```
pathcte/
├── .env                                 # Environment variables
├── .env.example                         # Template for environment variables
├── .gitignore
├── netlify.toml                         # Netlify configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── finn-avatar.svg
│   └── assets/
│       ├── images/
│       ├── sounds/
│       └── fonts/
│
├── netlify/
│   └── functions/                       # Serverless functions
│       ├── auth-callback.ts
│       ├── game-session-webhook.ts
│       ├── analytics-track.ts
│       └── azure-storage-proxy.ts
│
├── src/
│   ├── main.tsx                         # Application entry point
│   ├── App.tsx                          # Root component
│   ├── index.css                        # Global styles
│   │
│   ├── config/
│   │   ├── supabase.ts                  # Supabase client configuration
│   │   ├── azure-storage.ts             # Azure Blob Storage configuration
│   │   ├── constants.ts                 # Global constants
│   │   └── game-modes.ts                # Game mode configurations
│   │
│   ├── types/
│   │   ├── database.types.ts            # Generated Supabase types
│   │   ├── game.types.ts                # Game-related types
│   │   ├── user.types.ts                # User-related types
│   │   ├── pathkey.types.ts             # Pathkey-related types
│   │   └── index.ts                     # Export all types
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                   # Authentication hook
│   │   ├── useSupabase.ts               # Supabase client hook
│   │   ├── useGameSession.ts            # Game session management
│   │   ├── useRealtime.ts               # Real-time subscriptions
│   │   ├── usePathkeys.ts               # Pathkey operations
│   │   ├── useTokens.ts                 # Token management
│   │   ├── useQuestionSets.ts           # Question set operations
│   │   └── useAnalytics.ts              # Analytics tracking
│   │
│   ├── store/
│   │   ├── authStore.ts                 # Zustand store for auth
│   │   ├── gameStore.ts                 # Zustand store for game state
│   │   ├── uiStore.ts                   # Zustand store for UI state
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts              # Authentication services
│   │   ├── game.service.ts              # Game logic services
│   │   ├── pathkey.service.ts           # Pathkey services
│   │   ├── question.service.ts          # Question set services
│   │   ├── analytics.service.ts         # Analytics services
│   │   ├── azure-storage.service.ts     # Azure Blob Storage services
│   │   └── supabase.service.ts          # Supabase helper services
│   │
│   ├── utils/
│   │   ├── validators.ts                # Input validation functions
│   │   ├── formatters.ts                # Data formatting utilities
│   │   ├── game-helpers.ts              # Game calculation utilities
│   │   ├── date-utils.ts                # Date manipulation
│   │   └── error-handling.ts            # Error handling utilities
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── pathkeys/
│   │   │   ├── PathkeyCard.tsx
│   │   │   ├── PathkeyGrid.tsx
│   │   │   ├── PathkeyDetail.tsx
│   │   │   ├── KeyringDisplay.tsx
│   │   │   └── PathkeyUnlockAnimation.tsx
│   │   │
│   │   ├── game/
│   │   │   ├── GameLobby.tsx
│   │   │   ├── GameBoard.tsx
│   │   │   ├── QuestionDisplay.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── GameResults.tsx
│   │   │   └── modes/
│   │   │       ├── CareerQuest.tsx
│   │   │       ├── PathDefense.tsx
│   │   │       ├── CareerClash.tsx
│   │   │       └── ... (other game modes)
│   │   │
│   │   ├── teacher/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── QuestionSetList.tsx
│   │   │   ├── QuestionSetEditor.tsx
│   │   │   ├── QuestionEditor.tsx
│   │   │   ├── GameHostControls.tsx
│   │   │   ├── HomeworkAssignmentForm.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── StudentReports.tsx
│   │   │
│   │   ├── student/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CareerExplorer.tsx
│   │   │   ├── MyPathkeys.tsx
│   │   │   ├── MyProgress.tsx
│   │   │   └── HomeworkList.tsx
│   │   │
│   │   ├── market/
│   │   │   ├── MarketHome.tsx
│   │   │   ├── KeyPackCard.tsx
│   │   │   ├── PurchaseModal.tsx
│   │   │   └── TokenDisplay.tsx
│   │   │
│   │   ├── careers/
│   │   │   ├── CareerCard.tsx
│   │   │   ├── CareerDetail.tsx
│   │   │   ├── CareerGrid.tsx
│   │   │   └── CareerVideoPlayer.tsx
│   │   │
│   │   └── finn/
│   │       ├── FinnAvatar.tsx
│   │       ├── FinnDialog.tsx
│   │       └── FinnOnboarding.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── StudentDashboardPage.tsx
│   │   ├── TeacherDashboardPage.tsx
│   │   ├── JoinGamePage.tsx
│   │   ├── GamePage.tsx
│   │   ├── PathkeysPage.tsx
│   │   ├── MarketPage.tsx
│   │   ├── CareersPage.tsx
│   │   ├── QuestionSetsPage.tsx
│   │   ├── CreateQuestionSetPage.tsx
│   │   ├── HomeworkPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── game-engine/
│   │   ├── GameEngine.ts                # Core game engine
│   │   ├── GameState.ts                 # Game state management
│   │   ├── GameLoop.ts                  # Game loop logic
│   │   ├── InputHandler.ts              # Input handling
│   │   ├── CollisionDetection.ts        # Physics/collision
│   │   ├── modes/
│   │   │   ├── BaseGameMode.ts          # Abstract base class
│   │   │   ├── CareerQuest.ts
│   │   │   ├── PathDefense.ts
│   │   │   ├── CareerClash.ts
│   │   │   └── ... (other modes)
│   │   └── entities/
│   │       ├── Player.ts
│   │       ├── Tower.ts
│   │       ├── Enemy.ts
│   │       └── Projectile.ts
│   │
│   └── routes/
│       └── index.tsx                     # Route configuration
│
└── tests/
    ├── unit/
    │   ├── services/
    │   ├── utils/
    │   └── hooks/
    ├── integration/
    │   ├── auth.test.ts
    │   ├── game-flow.test.ts
    │   └── pathkey-unlock.test.ts
    └── e2e/
        ├── student-journey.spec.ts
        └── teacher-journey.spec.ts
```

---

## 4.2 CROSS-PLATFORM ARCHITECTURE

### 4.2.1 Shared Code Structure

To prepare for React Native mobile apps, organize code with maximum reusability:

```
pathcte/
├── packages/                            # Monorepo structure (recommended)
│   ├── shared/                          # Shared across web & mobile
│   │   ├── src/
│   │   │   ├── types/                   # 100% shared
│   │   │   ├── utils/                   # 90% shared (no DOM deps)
│   │   │   ├── services/                # 100% shared
│   │   │   ├── hooks/                   # 95% shared
│   │   │   ├── store/                   # 100% shared (Zustand)
│   │   │   ├── config/                  # Platform-specific exports
│   │   │   └── game-engine/             # 80% shared (abstract rendering)
│   │   └── package.json
│   │
│   ├── web/                             # Web-specific (current implementation)
│   │   ├── src/
│   │   │   ├── components/              # Web UI components
│   │   │   ├── pages/                   # Web pages
│   │   │   └── styles/                  # Tailwind CSS
│   │   └── package.json
│   │
│   └── mobile/                          # Future React Native app
│       ├── src/
│       │   ├── components/              # React Native components
│       │   ├── screens/                 # Mobile screens
│       │   └── navigation/              # React Navigation
│       ├── android/
│       ├── ios/
│       └── package.json
│
└── package.json                         # Root workspace config
```

### 4.2.2 Platform Abstraction Patterns

**Pattern 1: Platform-Specific Implementations**
```typescript
// packages/shared/src/services/storage.service.ts

export interface StorageService {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

// packages/web/src/services/storage.web.ts
export const storageService: StorageService = {
  setItem: async (key, value) => localStorage.setItem(key, value),
  getItem: async (key) => localStorage.getItem(key),
  removeItem: async (key) => localStorage.removeItem(key),
};

// packages/mobile/src/services/storage.native.ts (future)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService: StorageService = {
  setItem: async (key, value) => AsyncStorage.setItem(key, value),
  getItem: async (key) => AsyncStorage.getItem(key),
  removeItem: async (key) => AsyncStorage.removeItem(key),
};
```

**Pattern 2: Component Abstraction**
```typescript
// packages/shared/src/components/Button/Button.interface.ts
export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// packages/web/src/components/Button.tsx
export const Button = ({ onPress, title, ...props }: ButtonProps) => (
  <button onClick={onPress} {...props}>{title}</button>
);

// packages/mobile/src/components/Button.tsx (future)
import { TouchableOpacity, Text } from 'react-native';

export const Button = ({ onPress, title, ...props }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <Text>{title}</Text>
  </TouchableOpacity>
);
```

### 4.2.3 Recommended Monorepo Setup

**Option A: npm/yarn workspaces** (simpler, recommended for start)
```json
// Root package.json
{
  "name": "pathcte-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace=packages/web",
    "dev:mobile": "npm run start --workspace=packages/mobile",
    "build:web": "npm run build --workspace=packages/web",
    "build:mobile:android": "npm run android --workspace=packages/mobile",
    "build:mobile:ios": "npm run ios --workspace=packages/mobile"
  }
}
```

**Option B: Turborepo** (advanced, better for large teams)
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

### 4.2.4 Key Architectural Decisions for Mobile

**1. API-First Everything**
```typescript
// ✅ GOOD - All logic in service layer
export const gameService = {
  async joinGame(gameCode: string, displayName: string) {
    const { data, error } = await supabase
      .from('game_players')
      .insert({ game_code: gameCode, display_name: displayName });
    return { data, error };
  }
};

// ❌ BAD - Component handles logic
const JoinGame = () => {
  const handleJoin = async () => {
    await supabase.from('game_players').insert(...); // Don't do this!
  };
};
```

**2. No DOM Dependencies in Shared Code**
```typescript
// ❌ BAD - Uses window object
export const getScreenWidth = () => window.innerWidth;

// ✅ GOOD - Platform provides dimensions
export const getScreenWidth = (dimensions: { width: number; height: number }) => 
  dimensions.width;

// Web provides it
const dimensions = { width: window.innerWidth, height: window.innerHeight };

// Mobile provides it (future)
import { Dimensions } from 'react-native';
const dimensions = Dimensions.get('window');
```

**3. Abstract Rendering Logic**
```typescript
// packages/shared/src/game-engine/GameEngine.ts
export abstract class GameEngine {
  abstract render(): void; // Platform-specific
  
  update(deltaTime: number): void {
    // Shared game logic that works everywhere
    this.updatePhysics(deltaTime);
    this.detectCollisions();
    this.updateScores();
  }
}

// packages/web/src/game-engine/WebGameEngine.ts
export class WebGameEngine extends GameEngine {
  render() {
    // Canvas/WebGL rendering for web
  }
}

// packages/mobile/src/game-engine/NativeGameEngine.ts (future)
export class NativeGameEngine extends GameEngine {
  render() {
    // React Native Skia or Expo GL rendering
  }
}
```

**4. Design System Tokens**
```typescript
// packages/shared/src/design-system/tokens.ts
export const colors = {
  primary: {
    50: '#EFF6FF',
    500: '#0066CC',
    900: '#1E3A8A',
  },
  // ... all colors
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Use in web (Tailwind config)
// Use in mobile (StyleSheet)
```

### 4.2.5 Mobile-Optimized Features to Build Now

**Touch Gestures (implement in web, works in mobile)**
```typescript
// Use react-use-gesture (works in both platforms)
import { useGesture } from '@use-gesture/react';

const PathkeyCard = () => {
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      // Drag logic
    },
    onPinch: ({ offset: [scale] }) => {
      // Zoom logic
    },
  });
  
  return <div {...bind()}>...</div>;
};
```

**Haptic Feedback Abstraction**
```typescript
// packages/shared/src/services/haptics.service.ts
export interface HapticsService {
  impact(style: 'light' | 'medium' | 'heavy'): void;
  notification(type: 'success' | 'warning' | 'error'): void;
}

// Web - use Vibration API or no-op
export const haptics: HapticsService = {
  impact: (style) => {
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 40;
      navigator.vibrate(duration);
    }
  },
  notification: (type) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },
};
```

**Push Notifications Abstraction**
```typescript
// packages/shared/src/services/notifications.service.ts
export interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleNotification(options: NotificationOptions): Promise<string>;
}

// Implement for web (Web Push API)
// Implement for mobile (Firebase Cloud Messaging)
```

**Biometric Auth Abstraction**
```typescript
// packages/shared/src/services/biometric.service.ts
export interface BiometricService {
  isAvailable(): Promise<boolean>;
  authenticate(reason: string): Promise<boolean>;
}

// Web - use WebAuthn
// Mobile - use react-native-biometrics (future)
```

### 4.2.6 React Native Migration Checklist

When ready to build mobile apps, you'll:

**Phase 1: Setup (Week 1)**
- [ ] Initialize React Native with Expo (recommended) or bare React Native
- [ ] Set up monorepo structure
- [ ] Move shared code to `packages/shared`
- [ ] Configure TypeScript path aliases for all packages
- [ ] Set up shared ESLint/Prettier configs

**Phase 2: Core Infrastructure (Week 2-3)**
- [ ] Implement platform-specific navigation (React Navigation)
- [ ] Create React Native component equivalents (Button, Input, Card, etc.)
- [ ] Set up React Native Supabase client
- [ ] Implement secure token storage (react-native-keychain)
- [ ] Set up push notifications (Expo Notifications or FCM)

**Phase 3: Features (Week 4-8)**
- [ ] Port authentication screens
- [ ] Port game lobby and gameplay
- [ ] Port pathkey collection
- [ ] Port market and profiles
- [ ] Implement mobile-specific features (biometrics, haptics)

**Phase 4: Polish (Week 9-10)**
- [ ] Handle platform differences (iOS vs Android)
- [ ] Optimize performance (list virtualization, image caching)
- [ ] Add offline support
- [ ] Test on real devices
- [ ] Prepare for app store submission

### 4.2.7 Technologies for Mobile Apps (Future)

```json
{
  "dependencies": {
    "react-native": "^0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.6.0",
    "@supabase/supabase-js": "^2.38.0",
    "react-native-url-polyfill": "^2.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-keychain": "^8.1.0",
    "expo-notifications": "^0.24.0",
    "expo-haptics": "^12.8.0",
    "expo-local-authentication": "^13.8.0"
  }
}
```

**Recommended: Expo Managed Workflow**
- Easier setup and maintenance
- Over-the-air updates
- Expo modules for native features
- EAS Build for cloud builds
- Can eject to bare React Native if needed

```

### 5.1 Environment Variables

Create `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Azure Storage Configuration
VITE_AZURE_STORAGE_ACCOUNT_NAME=pathctestorage
VITE_AZURE_STORAGE_CONTAINER_NAME=pathcte-assets
AZURE_STORAGE_CONNECTION_STRING=your-connection-string-here
AZURE_STORAGE_SAS_TOKEN=your-sas-token-here

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8888/.netlify/functions

# Features Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REALTIME=true
VITE_ENABLE_DEBUG_MODE=false

# External Services
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# Game Configuration
VITE_MAX_PLAYERS_FREE=60
VITE_MAX_PLAYERS_PLUS=300
VITE_GAME_SESSION_TIMEOUT_MS=7200000
```

### 5.2 Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5173
  targetPort = 5173
  autoLaunch = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 6. IMPLEMENTATION PHASES

### Phase 1: Foundation & Authentication (Week 1-2)

**Objectives:**
- Set up project infrastructure **with mobile apps in mind**
- Implement authentication system **using platform-agnostic patterns**
- Create basic UI framework **with shared design system**
- Establish database connection **with optimized API layer**

**CRITICAL: Mobile-Ready Decisions**
> 🎯 Everything in Phase 1 should work identically in React Native with minimal changes.
> - Use `onPress` prop naming (works in web and mobile)
> - Avoid browser-specific APIs (no `window`, `document`, `localStorage` directly)
> - Keep all business logic in services (not components)
> - Design tokens instead of Tailwind classes in shared code

**Tasks:**

1. **Project Setup (Mobile-First)**
   ```bash
   # Option A: Monorepo from day 1 (recommended)
   mkdir pathcte && cd pathcte
   npm init -y
   
   # Set up workspaces
   mkdir -p packages/shared packages/web
   
   # Initialize web package
   cd packages/web
   npm create vite@latest . -- --template react-ts
   
   # Initialize shared package
   cd ../shared
   npm init -y
   
   # Install dependencies in shared (mobile-compatible only!)
   npm install @supabase/supabase-js zustand date-fns uuid zod
   
   # Install web-specific dependencies
   cd ../web
   npm install react-router-dom tailwindcss postcss autoprefixer
   
   # Option B: Start simple, refactor later
   # Build web app in standard structure, then migrate to monorepo before mobile
   ```

2. **Supabase Configuration (Cross-Platform)**
   - File: `packages/shared/src/config/supabase.ts`
   - Initialize Supabase client with environment variables
   - **NO** platform-specific code
   - Use URL polyfills for React Native compatibility
   
   ```typescript
   // ✅ GOOD - Works everywhere
   import { createClient } from '@supabase/supabase-js';
   
   export const supabase = createClient(
     process.env.VITE_SUPABASE_URL || '',
     process.env.VITE_SUPABASE_ANON_KEY || ''
   );
   
   // ❌ BAD - Uses window
   // Don't check window.location in shared code
   ```

3. **Authentication System (Platform-Agnostic)**
   - Files:
     - `packages/shared/src/services/auth.service.ts` ✅ Shared
     - `packages/shared/src/hooks/useAuth.ts` ✅ Shared
     - `packages/shared/src/store/authStore.ts` ✅ Shared (Zustand)
     - `packages/web/src/components/auth/LoginForm.tsx` 🌐 Web UI
     - [Future] `packages/mobile/src/screens/auth/LoginScreen.tsx` 📱 Mobile UI
   
   **Key Pattern: Separation of Logic and UI**
   ```typescript
   // ✅ Shared business logic
   // packages/shared/src/services/auth.service.ts
   export const authService = {
     signIn: async (email: string, password: string) => {
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       if (error) throw error;
       return data;
     },
     
     signUp: async (email: string, password: string) => {
       // Logic here
     },
     
     signOut: async () => {
       // Logic here
     },
   };
   
   // 🌐 Web UI component
   // packages/web/src/components/auth/LoginForm.tsx
   import { authService } from '@pathcte/shared/services/auth.service';
   
   export const LoginForm = () => {
     const handleSubmit = async () => {
       await authService.signIn(email, password);
     };
     // JSX with HTML elements
   };
   
   // 📱 Future mobile UI component
   // packages/mobile/src/screens/auth/LoginScreen.tsx
   import { authService } from '@pathcte/shared/services/auth.service';
   
   export const LoginScreen = () => {
     const handleSubmit = async () => {
       await authService.signIn(email, password);
     };
     // JSX with React Native components
   };
   ```

4. **Basic Layout (Design System)**
   - Files:
     - `packages/shared/src/design-system/tokens.ts` ✅ Shared
     - `packages/web/src/components/layout/Layout.tsx` 🌐 Web
   - Define spacing, colors, typography as constants
   - Use tokens in both Tailwind (web) and StyleSheet (mobile)
   
   ```typescript
   // packages/shared/src/design-system/tokens.ts
   export const tokens = {
     colors: {
       primary: '#0066CC',
       secondary: '#00CC66',
       // ...
     },
     spacing: {
       xs: 4,
       sm: 8,
       md: 16,
       lg: 24,
       xl: 32,
     },
   };
   
   // Web: tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: tokens.colors,
         spacing: tokens.spacing,
       },
     },
   };
   
   // Mobile (future): styles.ts
   const styles = StyleSheet.create({
     container: {
       padding: tokens.spacing.md,
       backgroundColor: tokens.colors.primary,
     },
   });
   ```

5. **Testing (Cross-Platform)**
   - Unit tests for services (run in Node, work everywhere)
   - Integration tests for auth flow
   - **NO** DOM-specific assertions in shared code tests

**Deliverables:**
- Users can sign up and log in ✅
- Protected routes work correctly ✅
- Basic navigation structure in place ✅
- **All business logic is platform-agnostic** ✅
- **Design system tokens defined** ✅

**Mobile-Readiness Checklist:**
- [ ] All data fetching in service layer
- [ ] No `window`, `document`, or `localStorage` in shared code
- [ ] Zustand store works without browser APIs
- [ ] Design tokens defined (not just Tailwind classes)
- [ ] Event handlers use `onPress` naming
- [ ] Image paths use URI strings (not imports)

---

### Phase 2: Core Data Models & Dashboard (Week 3-4)

**Objectives:**
- Implement user profiles
- Create student and teacher dashboards
- Set up data fetching with React Query
- Build reusable UI components

**Tasks:**

1. **User Profile System**
   - Files:
     - `src/services/supabase.service.ts`
     - `src/hooks/useProfile.ts`
     - `src/types/user.types.ts`
   - Profile creation on signup
   - Profile editing
   - User type differentiation (student/teacher)

2. **Common Components**
   - Files in `src/components/common/`:
     - `Button.tsx` (with variants and sizes)
     - `Input.tsx` (with validation)
     - `Modal.tsx` (reusable modal)
     - `Loading.tsx` (loading states)
     - `ErrorBoundary.tsx`
   - Implement with TypeScript and Tailwind
   - Add accessibility features

3. **Student Dashboard**
   - Files:
     - `src/pages/StudentDashboardPage.tsx`
     - `src/components/student/Dashboard.tsx`
   - Display token balance
   - Show recent games
   - Display unlocked pathkeys count
   - Quick links to join game, explore careers

4. **Teacher Dashboard**
   - Files:
     - `src/pages/TeacherDashboardPage.tsx`
     - `src/components/teacher/Dashboard.tsx`
   - Display recent games hosted
   - Show question sets
   - Quick actions: host game, create set
   - Basic statistics

5. **Testing**
   - Component tests for UI elements
   - Integration tests for dashboard rendering

**Deliverables:**
- Functional student and teacher dashboards
- Reusable component library
- Type-safe data fetching

---

### Phase 3: Pathkeys & Career System (Week 5-6)

**Objectives:**
- Implement pathkeys collection system
- Build career database and exploration
- Create market for purchasing key packs
- Implement token economy

**Tasks:**

1. **Pathkey Data Model**
   - Files:
     - `src/types/pathkey.types.ts`
     - `src/services/pathkey.service.ts`
     - `src/hooks/usePathkeys.ts`
   - CRUD operations for pathkeys
   - User pathkey collection management
   - Rarity system implementation

2. **Pathkey UI Components**
   - Files:
     - `src/components/pathkeys/PathkeyCard.tsx`
     - `src/components/pathkeys/PathkeyGrid.tsx`
     - `src/components/pathkeys/PathkeyDetail.tsx`
     - `src/components/pathkeys/KeyringDisplay.tsx`
     - `src/components/pathkeys/PathkeyUnlockAnimation.tsx`
   - Visual pathkey displays
   - Unlock animations (Framer Motion)
   - Collection organization

3. **Career System**
   - Files:
     - `src/types/career.types.ts`
     - `src/services/career.service.ts`
     - `src/components/careers/CareerCard.tsx`
     - `src/components/careers/CareerDetail.tsx`
     - `src/pages/CareersPage.tsx`
   - Career data model
   - Career profiles with details
   - Search and filter careers
   - Link careers to pathkeys

4. **Market System**
   - Files:
     - `src/components/market/MarketHome.tsx`
     - `src/components/market/KeyPackCard.tsx`
     - `src/components/market/PurchaseModal.tsx`
     - `src/components/market/TokenDisplay.tsx`
     - `src/pages/MarketPage.tsx`
   - Browse key packs
   - Purchase with tokens
   - Open packs and reveal keys
   - Transaction history

5. **Token Economy**
   - Files:
     - `src/hooks/useTokens.ts`
     - `src/utils/token-calculator.ts`
   - Award tokens for correct answers
   - Spend tokens in market
   - Token balance tracking
   - Transaction logging

6. **Azure Storage Integration**
   - Files:
     - `src/config/azure-storage.ts`
     - `src/services/azure-storage.service.ts`
   - Upload career images/videos
   - Pathkey artwork storage
   - CDN integration for fast loading

7. **Testing**
   - Unit tests for pathkey service
   - Integration tests for market purchases
   - E2E test for unlocking a pathkey

**Deliverables:**
- Functional pathkey collection system
- Career exploration interface
- Working market for key packs
- Token economy in place

---

### Phase 4: Question Sets & Content Creation (Week 7-8)

**Objectives:**
- Build question set creation and management
- Implement question editor
- Create discovery/browse system
- Enable sharing and importing

**Tasks:**

1. **Question Set Data Model**
   - Files:
     - `src/types/question.types.ts`
     - `src/services/question.service.ts`
     - `src/hooks/useQuestionSets.ts`
   - CRUD operations for question sets
   - CRUD operations for questions
   - Question set metadata

2. **Question Set Editor**
   - Files:
     - `src/components/teacher/QuestionSetEditor.tsx`
     - `src/components/teacher/QuestionEditor.tsx`
     - `src/pages/CreateQuestionSetPage.tsx`
   - Create new question sets
   - Add/edit/delete questions
   - Set question options and correct answers
   - Add images to questions
   - Set time limits and points
   - Preview questions

3. **Question Set List**
   - Files:
     - `src/components/teacher/QuestionSetList.tsx`
     - `src/pages/QuestionSetsPage.tsx`
   - View all created sets
   - Search and filter
   - Duplicate sets
   - Delete sets
   - Publish/unpublish

4. **Discovery System**
   - Browse public question sets
   - Search by topic, subject, grade level
   - Preview before using
   - Save favorites
   - Import sets

5. **Testing**
   - Unit tests for question service
   - Integration tests for creating a question set
   - E2E test for full question creation flow

**Deliverables:**
- Functional question set creation tool
- Question discovery system
- Teacher can create and manage content

---

### Phase 5: Live Game System (Week 9-11)

**Objectives:**
- Implement real-time game hosting
- Build game lobby system
- Create first game mode (Career Quest)
- Implement leaderboard and results

**Tasks:**

1. **Game Session Management**
   - Files:
     - `src/services/game.service.ts`
     - `src/hooks/useGameSession.ts`
     - `src/types/game.types.ts`
     - `src/store/gameStore.ts`
   - Create game session
   - Generate game code
   - Manage game state
   - Handle player connections

2. **Real-time System**
   - Files:
     - `src/hooks/useRealtime.ts`
     - `src/services/realtime.service.ts`
   - Supabase real-time subscriptions
   - Player join/leave events
   - Answer submissions
   - Score updates
   - Game state changes

3. **Game Lobby**
   - Files:
     - `src/components/game/GameLobby.tsx`
     - `src/components/game/PlayerList.tsx`
   - Display game code
   - Show connected players
   - Host controls (start game, kick players)
   - Settings configuration
   - Countdown before start

4. **Join Game Flow**
   - Files:
     - `src/pages/JoinGamePage.tsx`
   - Enter game code
   - Choose display name
   - Join lobby
   - Wait for host to start

5. **Question Display System**
   - Files:
     - `src/components/game/QuestionDisplay.tsx`
   - Show question text
   - Display answer options
   - Timer countdown
   - Submit answer
   - Show correct/incorrect feedback

6. **Leaderboard**
   - Files:
     - `src/components/game/Leaderboard.tsx`
   - Real-time score updates
   - Player rankings
   - Animated position changes

7. **Career Quest Game Mode**
   - Files:
     - `src/game-engine/modes/CareerQuest.ts`
     - `src/components/game/modes/CareerQuest.tsx`
   - Basic question-answer flow
   - Career chest system (choose 1 of 3)
   - Key collection
   - Score calculation
   - Random events

8. **Game Results**
   - Files:
     - `src/components/game/GameResults.tsx`
   - Final leaderboard
   - Individual stats (accuracy, speed)
   - Pathkeys earned
   - Tokens awarded
   - Share results

9. **Testing**
   - Unit tests for game logic
   - Integration tests for game flow
   - E2E test for complete game session

**Deliverables:**
- Working live game system
- Career Quest playable
- Real-time multiplayer functionality
- Results and rewards system

---

### Phase 6: Additional Game Modes (Week 12-14)

**Objectives:**
- Implement 5 more game modes
- Create game engine framework
- Build mode-specific UI components
- Optimize performance

**Tasks:**

1. **Game Engine Framework**
   - Files:
     - `src/game-engine/GameEngine.ts`
     - `src/game-engine/GameState.ts`
     - `src/game-engine/modes/BaseGameMode.ts`
   - Abstract base game mode class
   - Common game loop
   - State management
   - Input handling

2. **Path Defense Mode**
   - Files:
     - `src/game-engine/modes/PathDefense.ts`
     - `src/components/game/modes/PathDefense.tsx`
   - Tower placement system
   - Wave-based enemies
   - Tower upgrades
   - Strategic gameplay

3. **Career Clash Mode**
   - Files:
     - `src/game-engine/modes/CareerClash.ts`
     - `src/components/game/modes/CareerClash.tsx`
   - Battle royale mechanics
   - 1v1 elimination
   - Bracket system

4. **Career Factory Mode**
   - Files:
     - `src/game-engine/modes/CareerFactory.ts`
     - `src/components/game/modes/CareerFactory.tsx`
   - Resource production
   - Worker management
   - Upgrade system

5. **Career Racing Mode**
   - Files:
     - `src/game-engine/modes/CareerRacing.ts`
     - `src/components/game/modes/CareerRacing.tsx`
   - Track with obstacles
   - Speed boosts
   - Position tracking

6. **Pathcte Study Mode**
   - Files:
     - `src/game-engine/modes/PathcteStudy.ts`
     - `src/components/game/modes/PathcteStudy.tsx`
   - Pure question answering
   - Progress tracking
   - Review mode

7. **Testing**
   - Unit tests for each game mode
   - Performance testing
   - Load testing with many players

**Deliverables:**
- 6 playable game modes
- Reusable game engine
- Optimized performance

---

### Phase 7: Homework & Analytics (Week 15-16)

**Objectives:**
- Implement homework assignment system
- Build analytics dashboard
- Create reporting tools
- Add student progress tracking

**Tasks:**

1. **Homework System**
   - Files:
     - `src/services/homework.service.ts`
     - `src/hooks/useHomework.ts`
     - `src/components/teacher/HomeworkAssignmentForm.tsx`
     - `src/pages/HomeworkPage.tsx`
   - Create homework assignments
   - Share via link/QR code
   - Set due dates and goals
   - Track submissions

2. **Student Homework View**
   - Files:
     - `src/components/student/HomeworkList.tsx`
   - View assigned homework
   - Complete assignments
   - Track progress toward goal
   - Submit completion

3. **Analytics Dashboard**
   - Files:
     - `src/components/teacher/AnalyticsDashboard.tsx`
     - `src/services/analytics.service.ts`
     - `src/hooks/useAnalytics.ts`
   - Overall class statistics
   - Individual student performance
   - Question difficulty analysis
   - Engagement metrics
   - Career interest tracking

4. **Reports**
   - Files:
     - `src/components/teacher/StudentReports.tsx`
   - Generate detailed reports
   - Export to CSV/PDF
   - Share with parents
   - Historical data

5. **Testing**
   - Unit tests for analytics calculations
   - Integration tests for homework flow

**Deliverables:**
- Functional homework system
- Analytics dashboard
- Reporting capabilities

---

### Phase 8: Polish & Launch Prep (Week 17-18)

**Objectives:**
- UI/UX refinement
- Performance optimization
- Bug fixes and testing
- Documentation
- Deployment preparation

**Tasks:**

1. **UI/UX Polish**
   - Consistent styling across app
   - Animations and transitions
   - Loading states
   - Error messages
   - Empty states
   - Responsive design fixes

2. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies
   - Database query optimization

3. **Finn Integration**
   - Files:
     - `src/components/finn/FinnAvatar.tsx`
     - `src/components/finn/FinnDialog.tsx`
     - `src/components/finn/FinnOnboarding.tsx`
   - Finn appears throughout app
   - Contextual tips and guidance
   - Celebration animations
   - Onboarding flow

4. **Comprehensive Testing**
   - Full E2E test suite
   - Cross-browser testing
   - Mobile testing
   - Load testing
   - Security testing

5. **Documentation**
   - User guides
   - Teacher manual
   - API documentation
   - Developer setup guide

6. **Deployment**
   - Set up production Supabase project
   - Configure Azure Storage
   - Deploy to Netlify
   - Set up monitoring (Sentry)
   - Configure analytics

7. **Beta Testing**
   - Recruit beta teachers/students
   - Gather feedback
   - Fix critical issues
   - Iterate based on feedback

**Deliverables:**
- Production-ready application
- Comprehensive documentation
- Deployed to Netlify
- Beta feedback incorporated

---

## 7. COMPONENT SPECIFICATIONS

> **🎯 MOBILE-FIRST COMPONENT ARCHITECTURE**
> 
> All components follow a **Logic/UI separation pattern** for maximum code reuse:
> - **Shared Layer**: Business logic, hooks, services (100% reusable)
> - **Platform Layer**: UI components specific to web or mobile
> - **Common Props Interface**: Identical props across platforms
> 
> This pattern means ~70% of code is written once and works everywhere.

### 7.1 Component Architecture Pattern

**Three-Layer Component Structure:**

```
┌─────────────────────────────────────────┐
│     SHARED LOGIC LAYER (Packages)       │
│  ✅ Works in Web + React Native          │
├─────────────────────────────────────────┤
│  - Business Logic (services/)           │
│  - State Management (store/)            │
│  - Data Hooks (hooks/)                  │
│  - Type Definitions (types/)            │
│  - Utilities (utils/)                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      SHARED PROPS INTERFACE              │
│  ✅ Identical across platforms           │
├─────────────────────────────────────────┤
│  export interface ButtonProps {         │
│    onPress: () => void;                 │
│    title: string;                       │
│    variant?: 'primary' | 'secondary';   │
│    disabled?: boolean;                  │
│    loading?: boolean;                   │
│  }                                      │
└─────────────────────────────────────────┘
         ↙                    ↘
┌─────────────────┐   ┌─────────────────┐
│   WEB UI        │   │  MOBILE UI      │
│   (HTML/CSS)    │   │  (RN Components)│
├─────────────────┤   ├─────────────────┤
│  <button>       │   │  <TouchableOpac>│
│  className=""   │   │  <Text>         │
└─────────────────┘   └─────────────────┘
```

**Example: Login Component**

```typescript
// ============================================
// SHARED: packages/shared/src/hooks/useLoginForm.ts
// ✅ Works in both web and mobile
// ============================================
import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await authService.signIn(email, password);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await authService.signInWithGoogle();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleGoogleSignIn,
  };
};

// ============================================
// WEB: packages/web/src/components/auth/LoginForm.tsx
// 🌐 Web-specific UI
// ============================================
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '@pathcte/shared/hooks/useLoginForm';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleGoogleSignIn,
  } = useLoginForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit();
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In to Pathcte</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Log In
        </Button>
      </form>
      
      <div className="mt-4">
        <Button 
          onClick={handleGoogleSignIn} 
          variant="outline" 
          fullWidth
          disabled={loading}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

// ============================================
// MOBILE: packages/mobile/src/screens/auth/LoginScreen.tsx
// 📱 Mobile-specific UI (Future implementation)
// ============================================
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoginForm } from '@pathcte/shared/hooks/useLoginForm';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { tokens } from '@pathcte/shared/design-system/tokens';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleGoogleSignIn,
  } = useLoginForm(); // Same hook as web! 🎉

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (result.success) {
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In to Pathcte</Text>
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        disabled={loading}
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <Button 
        onPress={onSubmit} 
        title="Log In"
        variant="primary"
        loading={loading}
      />
      
      <Button 
        onPress={handleGoogleSignIn} 
        title="Sign in with Google"
        variant="outline"
        disabled={loading}
        style={styles.googleButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background,
  },
  title: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: tokens.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  errorContainer: {
    backgroundColor: tokens.colors.error[50],
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
  },
  errorText: {
    color: tokens.colors.error[600],
    fontSize: tokens.typography.fontSize.sm,
  },
  googleButton: {
    marginTop: tokens.spacing.md,
  },
});
```

**Key Benefits of This Pattern:**
- ✅ `useLoginForm` hook written **once**, used in both platforms
- ✅ All business logic (validation, API calls, error handling) is shared
- ✅ Only UI rendering differs between platforms
- ✅ Type safety across entire stack
- ✅ Easy to test (test the shared hook once)
- ✅ When you fix a bug, it's fixed everywhere

### 7.1 Authentication Components

#### LoginForm Component
```typescript
// src/components/auth/LoginForm.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In to Pathcte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        
        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        <Button type="submit" variant="primary" fullWidth>
          Log In
        </Button>
      </form>
      
      <div className="mt-4">
        <Button 
          onClick={handleGoogleSignIn} 
          variant="outline" 
          fullWidth
        >
          Sign in with Google
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm">
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>
      
      <div className="mt-2 text-center text-sm">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
};
```

#### ProtectedRoute Component
```typescript
// src/components/auth/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'student' | 'teacher';
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && profile?.user_type !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

### 7.2 Common Components (Cross-Platform)

> **Strategy:** Build UI components twice (web + mobile) but share the props interface

#### Button Component

**Shared Props Interface:**
```typescript
// packages/shared/src/components/Button/Button.types.ts
export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string; // Icon name (lookup in icon library)
  testID?: string;
}
```

**Web Implementation:**
```typescript
// packages/web/src/components/common/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { ButtonProps } from '@pathcte/shared/components/Button/Button.types';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        sm: 'text-sm px-3 py-1.5 min-h-[32px]',
        md: 'text-base px-4 py-2 min-h-[40px]',
        lg: 'text-lg px-6 py-3 min-h-[48px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
>(({ 
  onPress, 
  title, 
  variant, 
  size, 
  fullWidth, 
  disabled, 
  loading,
  className, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, fullWidth, className })}
      onClick={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {title}
    </button>
  );
});

Button.displayName = 'Button';
```

**Mobile Implementation (Future):**
```typescript
// packages/mobile/src/components/common/Button.tsx

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { ButtonProps } from '@pathcte/shared/components/Button/Button.types';
import { tokens } from '@pathcte/shared/design-system/tokens';

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  testID,
}) => {
  const containerStyle = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading && <ActivityIndicator color={getSpinnerColor(variant)} />}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
  },
  
  // Variants
  variant_primary: {
    backgroundColor: tokens.colors.primary,
  },
  variant_secondary: {
    backgroundColor: tokens.colors.secondary,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: tokens.colors.gray[300],
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: tokens.colors.error[600],
  },
  
  // Sizes
  size_sm: {
    paddingVertical: tokens.spacing.xs,
    minHeight: 32,
  },
  size_md: {
    paddingVertical: tokens.spacing.sm,
    minHeight: 40,
  },
  size_lg: {
    paddingVertical: tokens.spacing.md,
    minHeight: 48,
  },
  
  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Text
  text: {
    fontWeight: tokens.typography.fontWeight.medium,
    textAlign: 'center',
  },
  text_primary: {
    color: tokens.colors.white,
  },
  text_secondary: {
    color: tokens.colors.white,
  },
  text_outline: {
    color: tokens.colors.gray[700],
  },
  text_ghost: {
    color: tokens.colors.gray[700],
  },
  text_danger: {
    color: tokens.colors.white,
  },
  text_sm: {
    fontSize: tokens.typography.fontSize.sm,
  },
  text_md: {
    fontSize: tokens.typography.fontSize.base,
  },
  text_lg: {
    fontSize: tokens.typography.fontSize.lg,
  },
});

const getSpinnerColor = (variant: string): string => {
  switch (variant) {
    case 'outline':
    case 'ghost':
      return tokens.colors.gray[700];
    default:
      return tokens.colors.white;
  }
};
```

#### Input Component

**Shared Props Interface:**
```typescript
// packages/shared/src/components/Input/Input.types.ts
export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
}
```

**Web Implementation:**
```typescript
// packages/web/src/components/common/Input.tsx

import { forwardRef } from 'react';
import { InputProps } from '@pathcte/shared/components/Input/Input.types';

// Adapt web onChange to onChangeText pattern
export const Input = forwardRef<HTMLInputElement, InputProps & { 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>(
  ({ 
    value,
    onChangeText,
    onChange,
    label, 
    error, 
    helperText, 
    disabled,
    required,
    secureTextEntry,
    keyboardType,
    className,
    ...props 
  }, ref) => {
    
    // Convert web onChange to onChangeText
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeText(e.target.value);
      onChange?.(e);
    };
    
    // Map keyboardType to HTML input type
    const inputType = secureTextEntry 
      ? 'password' 
      : keyboardType === 'email-address' 
        ? 'email' 
        : keyboardType === 'numeric' 
          ? 'number' 
          : 'text';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Mobile Implementation (Future):**
```typescript
// packages/mobile/src/components/common/Input.tsx

import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet 
} from 'react-native';
import { InputProps } from '@pathcte/shared/components/Input/Input.types';
import { tokens } from '@pathcte/shared/design-system/tokens';

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  testID,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        placeholderTextColor={tokens.colors.gray[400]}
        testID={testID}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.gray[700],
    marginBottom: tokens.spacing.xs,
  },
  required: {
    color: tokens.colors.error[500],
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.fontSize.base,
    backgroundColor: tokens.colors.white,
  },
  inputError: {
    borderColor: tokens.colors.error[500],
  },
  inputDisabled: {
    backgroundColor: tokens.colors.gray[100],
  },
  errorText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.error[600],
    marginTop: tokens.spacing.xs,
  },
  helperText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.gray[500],
    marginTop: tokens.spacing.xs,
  },
});
```

**Usage (Identical in both platforms!):**
```typescript
// Works in web
<Input
  value={email}
  onChangeText={setEmail}
  label="Email Address"
  keyboardType="email-address"
  required
/>

// Same code works in mobile!
<Input
  value={email}
  onChangeText={setEmail}
  label="Email Address"
  keyboardType="email-address"
  required
/>
```

### 7.2 Common Components (Original Web-Only)

#### Button Component
```typescript
// src/components/common/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

#### Input Component
```typescript
// src/components/common/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 7.3 Game Components

#### GameLobby Component
```typescript
// src/components/game/GameLobby.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameSession } from '@/hooks/useGameSession';
import { useRealtime } from '@/hooks/useRealtime';
import { Button } from '@/components/common/Button';
import { PlayerList } from './PlayerList';
import { GameCode } from './GameCode';

export const GameLobby = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const { session, startGame, isHost } = useGameSession(gameCode!);
  const [players, setPlayers] = useState<any[]>([]);
  
  // Subscribe to player updates
  useRealtime(`game_players:game_session_id=eq.${session?.id}`, (payload) => {
    if (payload.eventType === 'INSERT') {
      setPlayers(prev => [...prev, payload.new]);
    } else if (payload.eventType === 'DELETE') {
      setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
    }
  });

  useEffect(() => {
    if (session?.status === 'in_progress') {
      navigate(`/game/${gameCode}/play`);
    }
  }, [session?.status, gameCode, navigate]);

  const handleStartGame = async () => {
    if (players.length < 2) {
      alert('Need at least 2 players to start!');
      return;
    }
    await startGame();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Game Lobby
      </h1>
      
      <GameCode code={gameCode!} />
      
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Players ({players.length}/{session?.max_players})
        </h2>
        
        <PlayerList players={players} />
        
        {isHost && (
          <div className="mt-6 flex gap-4">
            <Button 
              onClick={handleStartGame}
              disabled={players.length < 2}
              fullWidth
            >
              Start Game
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
```

#### QuestionDisplay Component
```typescript
// src/components/game/QuestionDisplay.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';

interface QuestionDisplayProps {
  question: {
    id: string;
    question_text: string;
    options: Array<{ text: string; is_correct: boolean }>;
    time_limit_seconds: number;
    image_url?: string;
  };
  onAnswer: (answerIndex: number, timeMs: number) => void;
}

export const QuestionDisplay = ({ question, onAnswer }: QuestionDisplayProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.time_limit_seconds);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit with no answer if time runs out
          if (selectedAnswer === null) {
            onAnswer(-1, Date.now() - startTime);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedAnswer, onAnswer, startTime]);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const timeTaken = Date.now() - startTime;
      onAnswer(selectedAnswer, timeTaken);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Timer */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">Time Left:</span>
          <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-600' : 'bg-blue-600'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / question.time_limit_seconds) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{question.question_text}</h2>
        
        {question.image_url && (
          <img 
            src={question.image_url} 
            alt="Question" 
            className="max-w-full h-auto rounded-lg mb-4"
          />
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedAnswer(index)}
            className={`
              p-4 rounded-lg text-left transition-all
              ${selectedAnswer === index
                ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                : 'bg-white hover:bg-gray-50 border-2 border-gray-300'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-semibold mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option.text}
          </motion.button>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={selectedAnswer === null}
        fullWidth
        size="lg"
      >
        Submit Answer
      </Button>
    </div>
  );
};
```

### 7.4 Pathkey Components

#### PathkeyCard Component
```typescript
// src/components/pathkeys/PathkeyCard.tsx

import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';

interface PathkeyCardProps {
  pathkey: {
    id: string;
    name: string;
    rarity: string;
    image_url: string;
    key_type: string;
  };
  owned?: boolean;
  quantity?: number;
  onClick?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-gray-300 to-gray-500',
  rare: 'from-yellow-400 to-yellow-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-pink-400 via-purple-500 to-blue-600',
};

export const PathkeyCard = ({ pathkey, owned = false, quantity = 0, onClick }: PathkeyCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        ${owned ? 'opacity-100' : 'opacity-50'}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        h-48 bg-gradient-to-br ${rarityColors[pathkey.rarity as keyof typeof rarityColors]}
        flex items-center justify-center p-4
      `}>
        {owned ? (
          <img 
            src={pathkey.image_url} 
            alt={pathkey.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <Lock className="w-16 h-16 text-white opacity-50" />
        )}
      </div>
      
      <div className="bg-white p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate">{pathkey.name}</h3>
          {quantity > 1 && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              x{quantity}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs text-gray-600 capitalize">
            {pathkey.rarity}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
```

---

## 8. API ENDPOINTS & FUNCTIONS

### 8.1 Supabase Edge Functions

#### Game Session Management
```typescript
// supabase/functions/create-game-session/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { host_id, question_set_id, game_mode, settings, max_players } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate unique game code
    const gameCode = generateGameCode();

    const { data, error } = await supabaseClient
      .from('game_sessions')
      .insert({
        game_code: gameCode,
        host_id,
        question_set_id,
        game_mode,
        settings,
        max_players,
        status: 'waiting',
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

function generateGameCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

### 8.2 Netlify Functions

#### Azure Storage Proxy
```typescript
// netlify/functions/azure-storage-proxy.ts

import { Handler } from '@netlify/functions';
import { BlobServiceClient } from '@azure/storage-blob';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fileName, fileType, fileData } = JSON.parse(event.body || '{}');

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString || !containerName) {
      throw new Error('Azure Storage not configured');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload file
    const buffer = Buffer.from(fileData, 'base64');
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: fileType },
    });

    const url = blockBlobClient.url;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
```

#### Analytics Tracking
```typescript
// netlify/functions/analytics-track.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { user_id, event_type, event_name, properties, session_id } = JSON.parse(
      event.body || '{}'
    );

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase.from('analytics_events').insert({
      user_id,
      event_type,
      event_name,
      properties,
      session_id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
```

---

## 9. STATE MANAGEMENT

### 9.1 Zustand Stores

#### Auth Store
```typescript
// src/store/authStore.ts

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/user.types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, session: null, profile: null, loading: false }),
}));
```

#### Game Store
```typescript
// src/store/gameStore.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Player {
  id: string;
  displayName: string;
  score: number;
  isConnected: boolean;
}

interface GameState {
  sessionId: string | null;
  gameCode: string | null;
  gameMode: string | null;
  status: 'waiting' | 'in_progress' | 'completed';
  players: Player[];
  currentQuestionIndex: number;
  totalQuestions: number;
  
  // Actions
  setSession: (sessionId: string, gameCode: string, gameMode: string) => void;
  setStatus: (status: 'waiting' | 'in_progress' | 'completed') => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  nextQuestion: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>()(
  immer((set) => ({
    sessionId: null,
    gameCode: null,
    gameMode: null,
    status: 'waiting',
    players: [],
    currentQuestionIndex: 0,
    totalQuestions: 0,
    
    setSession: (sessionId, gameCode, gameMode) => 
      set((state) => {
        state.sessionId = sessionId;
        state.gameCode = gameCode;
        state.gameMode = gameMode;
      }),
    
    setStatus: (status) => 
      set((state) => {
        state.status = status;
      }),
    
    addPlayer: (player) => 
      set((state) => {
        state.players.push(player);
      }),
    
    removePlayer: (playerId) => 
      set((state) => {
        state.players = state.players.filter(p => p.id !== playerId);
      }),
    
    updatePlayer: (playerId, updates) => 
      set((state) => {
        const player = state.players.find(p => p.id === playerId);
        if (player) {
          Object.assign(player, updates);
        }
      }),
    
    nextQuestion: () => 
      set((state) => {
        state.currentQuestionIndex += 1;
      }),
    
    reset: () => 
      set((state) => {
        state.sessionId = null;
        state.gameCode = null;
        state.gameMode = null;
        state.status = 'waiting';
        state.players = [];
        state.currentQuestionIndex = 0;
        state.totalQuestions = 0;
      }),
  }))
);
```

---

## 10. AUTHENTICATION FLOW

### 10.1 Auth Hook Implementation

```typescript
// src/hooks/useAuth.ts

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/config/supabase';
import { Profile } from '@/types/user.types';

export const useAuth = () => {
  const { user, session, profile, loading, setUser, setSession, setProfile, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      ...userData,
    });

    if (profileError) throw profileError;

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    reset();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data as Profile);
    return data;
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };
};
```

---

## 11. GAME ENGINE ARCHITECTURE

### 11.1 Base Game Mode Class

```typescript
// src/game-engine/modes/BaseGameMode.ts

import { GameState } from '../GameState';
import { Question } from '@/types/question.types';

export abstract class BaseGameMode {
  protected state: GameState;
  protected currentQuestion: Question | null = null;
  protected questionStartTime: number = 0;

  constructor(state: GameState) {
    this.state = state;
  }

  // Abstract methods that each game mode must implement
  abstract initialize(): Promise<void>;
  abstract onQuestionStart(question: Question): void;
  abstract onAnswer(playerId: string, answerIndex: number, timeMs: number): void;
  abstract onQuestionEnd(): void;
  abstract calculateScore(isCorrect: boolean, timeMs: number): number;
  abstract update(deltaTime: number): void;
  abstract render(): void;
  abstract cleanup(): void;

  // Common methods
  protected isAnswerCorrect(question: Question, answerIndex: number): boolean {
    return question.options[answerIndex]?.is_correct || false;
  }

  protected calculateBaseScore(isCorrect: boolean, timeMs: number, maxPoints: number): number {
    if (!isCorrect) return 0;
    
    // Award more points for faster answers
    const timeBonus = Math.max(0, 1 - (timeMs / (this.currentQuestion?.time_limit_seconds || 30) * 1000));
    return Math.round(maxPoints * (0.5 + 0.5 * timeBonus));
  }

  protected async awardTokens(playerId: string, amount: number): Promise<void> {
    // Implementation to award tokens via Supabase
  }

  protected async awardPathkey(playerId: string, pathkeyId: string): Promise<void> {
    // Implementation to award pathkey via Supabase
  }
}
```

### 11.2 Career Quest Implementation

```typescript
// src/game-engine/modes/CareerQuest.ts

import { BaseGameMode } from './BaseGameMode';
import { Question } from '@/types/question.types';

interface CareerChest {
  type: 'key' | 'swap' | 'steal' | 'mystery';
  value: number;
}

export class CareerQuest extends BaseGameMode {
  private chests: CareerChest[] = [];
  private playerKeys: Map<string, number> = new Map();

  async initialize(): Promise<void> {
    this.generateChests();
    // Initialize all players with 0 keys
    this.state.players.forEach(player => {
      this.playerKeys.set(player.id, 0);
    });
  }

  onQuestionStart(question: Question): void {
    this.currentQuestion = question;
    this.questionStartTime = Date.now();
  }

  onAnswer(playerId: string, answerIndex: number, timeMs: number): void {
    if (!this.currentQuestion) return;

    const isCorrect = this.isAnswerCorrect(this.currentQuestion, answerIndex);
    
    if (isCorrect) {
      // Player gets to choose a chest
      this.showChestChoice(playerId);
    }

    const score = this.calculateScore(isCorrect, timeMs);
    this.state.updatePlayerScore(playerId, score);
  }

  onQuestionEnd(): void {
    // Random events could happen here
    if (Math.random() < 0.2) {
      this.triggerRandomEvent();
    }
  }

  calculateScore(isCorrect: boolean, timeMs: number): number {
    if (!this.currentQuestion) return 0;
    return this.calculateBaseScore(isCorrect, timeMs, this.currentQuestion.points);
  }

  private generateChests(): void {
    this.chests = [
      { type: 'key', value: Math.floor(Math.random() * 50) + 10 },
      { type: 'swap', value: 0 },
      { type: 'steal', value: 50 },
    ];
  }

  private showChestChoice(playerId: string): void {
    // Emit event for UI to show chest selection
    this.state.emit('show-chest-choice', { playerId, chests: this.chests });
  }

  private triggerRandomEvent(): void {
    const events = ['shuffle', 'double', 'half'];
    const event = events[Math.floor(Math.random() * events.length)];
    
    this.state.emit('random-event', { type: event });
    
    // Apply event effects
    switch (event) {
      case 'shuffle':
        this.shuffleKeys();
        break;
      case 'double':
        this.doubleKeys();
        break;
      case 'half':
        this.halfKeys();
        break;
    }
  }

  private shuffleKeys(): void {
    const keyAmounts = Array.from(this.playerKeys.values());
    const playerIds = Array.from(this.playerKeys.keys());
    
    // Fisher-Yates shuffle
    for (let i = keyAmounts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keyAmounts[i], keyAmounts[j]] = [keyAmounts[j], keyAmounts[i]];
    }
    
    playerIds.forEach((id, index) => {
      this.playerKeys.set(id, keyAmounts[index]);
    });
  }

  private doubleKeys(): void {
    this.playerKeys.forEach((keys, playerId) => {
      this.playerKeys.set(playerId, keys * 2);
    });
  }

  private halfKeys(): void {
    this.playerKeys.forEach((keys, playerId) => {
      this.playerKeys.set(playerId, Math.floor(keys / 2));
    });
  }

  update(deltaTime: number): void {
    // Update game logic each frame
  }

  render(): void {
    // Render game state (handled by React components)
  }

  cleanup(): void {
    this.chests = [];
    this.playerKeys.clear();
  }
}
```

---

## 12. AZURE STORAGE INTEGRATION

### 12.1 Azure Storage Service

```typescript
// src/services/azure-storage.service.ts

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

class AzureStorageService {
  private containerClient: ContainerClient;

  constructor() {
    const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    const sasToken = import.meta.env.AZURE_STORAGE_SAS_TOKEN;
    const containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);
    
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return blockBlobClient.url;
  }

  async uploadBase64(base64Data: string, fileName: string, mimeType: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: mimeType,
      },
    });

    return blockBlobClient.url;
  }

  async deleteFile(path: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);
    await blockBlobClient.delete();
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const files: string[] = [];
    
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      files.push(blob.name);
    }
    
    return files;
  }

  getFileUrl(path: string): string {
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);
    return blockBlobClient.url;
  }
}

export const azureStorageService = new AzureStorageService();
```

### 12.2 Usage in Components

```typescript
// Example: Uploading a career image

import { azureStorageService } from '@/services/azure-storage.service';

const handleImageUpload = async (file: File) => {
  try {
    const path = `careers/${Date.now()}-${file.name}`;
    const url = await azureStorageService.uploadFile(file, path);
    
    // Save URL to database
    await supabase
      .from('careers')
      .update({ image_url: url })
      .eq('id', careerId);
      
    console.log('Image uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 13. TESTING STRATEGY

### 13.1 Unit Tests

```typescript
// tests/unit/services/pathkey.service.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { pathkeyService } from '@/services/pathkey.service';

describe('PathkeyService', () => {
  beforeEach(() => {
    // Setup test database
  });

  it('should award pathkey to user', async () => {
    const userId = 'test-user-id';
    const pathkeyId = 'test-pathkey-id';
    
    await pathkeyService.awardPathkey(userId, pathkeyId);
    
    const userPathkeys = await pathkeyService.getUserPathkeys(userId);
    expect(userPathkeys).toContainEqual(
      expect.objectContaining({ pathkey_id: pathkeyId })
    );
  });

  it('should increase quantity for duplicate pathkeys', async () => {
    const userId = 'test-user-id';
    const pathkeyId = 'test-pathkey-id';
    
    await pathkeyService.awardPathkey(userId, pathkeyId);
    await pathkeyService.awardPathkey(userId, pathkeyId);
    
    const userPathkeys = await pathkeyService.getUserPathkeys(userId);
    const pathkey = userPathkeys.find(p => p.pathkey_id === pathkeyId);
    
    expect(pathkey?.quantity).toBe(2);
  });
});
```

### 13.2 Integration Tests

```typescript
// tests/integration/auth.test.ts

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';

describe('Authentication Flow', () => {
  it('should log in user successfully', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
```

### 13.3 E2E Tests

```typescript
// tests/e2e/student-journey.spec.ts

import { test, expect } from '@playwright/test';

test('student can join game and answer questions', async ({ page }) => {
  // Navigate to join game page
  await page.goto('http://localhost:5173/join');
  
  // Enter game code
  await page.fill('input[name="gameCode"]', 'ABC123');
  await page.fill('input[name="displayName"]', 'TestStudent');
  await page.click('button[type="submit"]');
  
  // Wait for lobby
  await expect(page.locator('text=Game Lobby')).toBeVisible();
  
  // Wait for game to start (simulated by test setup)
  await page.waitForSelector('text=Question 1');
  
  // Answer question
  await page.click('button:has-text("Option A")');
  await page.click('button:has-text("Submit Answer")');
  
  // Check for feedback
  await expect(page.locator('text=Correct!')).toBeVisible();
  
  // Check tokens were awarded
  await expect(page.locator('text=+10 tokens')).toBeVisible();
});
```

---

## 14. DEPLOYMENT PIPELINE

### 14.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy to Netlify

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_AZURE_STORAGE_ACCOUNT_NAME: ${{ secrets.VITE_AZURE_STORAGE_ACCOUNT_NAME }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 14.2 Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing
- [ ] Environment variables configured in Netlify
- [ ] Supabase production project created
- [ ] Azure Storage container created
- [ ] Database migrations applied
- [ ] Seed data loaded (careers, pathkeys)
- [ ] RLS policies enabled and tested
- [ ] Error monitoring configured (Sentry)

**Post-Deployment:**
- [ ] Smoke tests on production
- [ ] Database backups configured
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Test critical user flows
- [ ] Verify real-time connections
- [ ] Test payment processing (if applicable)

---

## 15. PERFORMANCE OPTIMIZATION

### 15.1 Code Splitting

```typescript
// src/routes/index.tsx

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loading } from '@/components/common/Loading';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const GamePage = lazy(() => import('@/pages/GamePage'));
const TeacherDashboard = lazy(() => import('@/pages/TeacherDashboardPage'));

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game/:gameCode" element={<GamePage />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

### 15.2 Image Optimization

```typescript
// src/components/common/OptimizedImage.tsx

import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export const OptimizedImage = ({ src, alt, className, sizes }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate srcset for responsive images
  const srcSet = `
    ${src}?w=400 400w,
    ${src}?w=800 800w,
    ${src}?w=1200 1200w
  `;

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
```

### 15.3 React Query Configuration

```typescript
// src/config/react-query.ts

import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## 16. SECURITY CONSIDERATIONS

### 16.1 RLS Policy Examples

```sql
-- Only game host can update game session
CREATE POLICY "Game hosts can update own sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Students can only see their own submissions
CREATE POLICY "Students see own submissions"
  ON homework_submissions FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can only see submissions for their assignments
CREATE POLICY "Teachers see assignment submissions"
  ON homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework_assignments
      WHERE id = homework_assignment_id
      AND teacher_id = auth.uid()
    )
  );
```

### 16.2 Input Validation

```typescript
// src/utils/validators.ts

import { z } from 'zod';

export const gameCodeSchema = z
  .string()
  .length(6)
  .regex(/^[A-Z0-9]{6}$/, 'Game code must be 6 alphanumeric characters');

export const questionSetSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1),
  grade_level: z.array(z.number().min(1).max(12)),
  questions: z.array(z.object({
    question_text: z.string().min(5),
    options: z.array(z.object({
      text: z.string().min(1),
      is_correct: z.boolean(),
    })).min(2).max(4),
    time_limit_seconds: z.number().min(5).max(300),
    points: z.number().min(1).max(1000),
  })).min(1).max(100),
});

export const validateGameCode = (code: string): boolean => {
  return gameCodeSchema.safeParse(code).success;
};
```

### 16.3 XSS Prevention

```typescript
// src/utils/sanitize.ts

import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

---

## 17. DEVELOPMENT WORKFLOW

### 17.1 Claude Code Instructions

**Starting a New Feature:**
```
1. Review this implementation guide section for the feature
2. Check the file structure to identify files to create/modify
3. Implement the feature following TypeScript best practices
4. Add proper type definitions
5. Include error handling
6. Write unit tests for new functions
7. Update documentation if needed
```

**Example Claude Code Prompt:**
```
Please implement the Pathkey Card component following the specifications in Section 7.4 of the implementation guide. The component should:
- Accept pathkey data as props
- Display rarity with appropriate colors
- Show lock icon if not owned
- Include hover animations
- Use TypeScript with proper types
- Follow the existing component patterns in src/components/common/
```

### 17.2 Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/pathkey-collection
git add .
git commit -m "feat: implement pathkey collection display"
git push origin feature/pathkey-collection

# Create PR for review
```

### 17.3 Code Review Checklist

- [ ] TypeScript types properly defined
- [ ] No any types used
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Accessibility attributes added
- [ ] Responsive design works on mobile
- [ ] Tests written and passing
- [ ] No console.log statements
- [ ] Environment variables used correctly
- [ ] Database queries optimized
- [ ] RLS policies in place

---

## APPENDIX A: Quick Reference Commands

```bash
# Development
npm run dev                  # Start development server
npm run build               # Build for production
npm run preview             # Preview production build
npm run test                # Run all tests
npm run test:unit           # Run unit tests
npm run test:e2e            # Run E2E tests
npm run lint                # Run ESLint
npm run type-check          # Run TypeScript compiler

# Supabase
npx supabase start          # Start local Supabase
npx supabase stop           # Stop local Supabase
npx supabase db reset       # Reset database
npx supabase gen types      # Generate TypeScript types
npx supabase migration new  # Create new migration

# Netlify
netlify dev                 # Run local dev with functions
netlify deploy             # Deploy to preview
netlify deploy --prod      # Deploy to production
```

## APPENDIX B: Environment Variables Template

```env
# Copy to .env and fill in values

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Azure Storage
VITE_AZURE_STORAGE_ACCOUNT_NAME=
VITE_AZURE_STORAGE_CONTAINER_NAME=
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_SAS_TOKEN=

# Application
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8888/.netlify/functions

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REALTIME=true
VITE_ENABLE_DEBUG_MODE=true

# Monitoring
VITE_SENTRY_DSN=
```

---

## APPENDIX: GAP ANALYSIS & FEATURE ROADMAP

### A1. Design Document Features Not Yet in Implementation

This section lists features from `Pathcte_Game_Design_Document.md` that are not yet covered in this implementation guide or the codebase.

#### A1.1 Teacher Tools (Critical Priority)

**Question Set Creation Interface**
- **Design Doc Reference:** Section 3 (Question Set System)
- **Current Status:** ❌ Not implemented
- **Gap:** Teachers can only use pre-seeded question sets; no UI to create custom content
- **Required Components:**
  - `QuestionSetEditor` page with form builder
  - `QuestionForm` component for individual questions
  - `QuestionPreview` for testing
  - CSV import functionality
  - Question bank search/filter
  - Set metadata editor (grade level, subject, difficulty)
- **Estimated Effort:** 2-3 weeks
- **Blockers:** None (DB schema ready)

**Homework Assignment System**
- **Design Doc Reference:** Section 4 (Homework & Assignment System)
- **Current Status:** ❌ Not implemented
- **Gap:** No way to assign async games, set deadlines, or track completion
- **Required Components:**
  - `HomeworkCreator` page
  - `HomeworkAssignmentCard` component
  - Assignment link/QR code generator
  - LMS integration prep (Google Classroom, Canvas)
  - Student homework dashboard view
  - Completion tracking service
- **Estimated Effort:** 2-3 weeks
- **Dependencies:** Question Set Creator must be done first

**Teacher Analytics Dashboard**
- **Design Doc Reference:** Section 5 (Teacher Dashboard & Analytics)
- **Current Status:** ❌ Not implemented
- **Gap:** No post-game reports, class analytics, or student progress tracking
- **Required Components:**
  - `AnalyticsDashboard` page
  - `GameReport` detailed view
  - `StudentProgressCard` component
  - CSV export functionality
  - Chart library integration (recharts/chart.js)
  - Career interest pattern visualization
- **Estimated Effort:** 3-4 weeks
- **Dependencies:** Analytics events service (DB ready, tracking not implemented)

#### A1.2 Game Modes (High Priority)

**Current Status:** Only basic quiz mode implemented
**Design Doc Reference:** Section 2 (Game Modes)
**Gap:** 13 of 20 designed game modes not built

**Priority Order for Implementation:**

1. **Career Quest (Gold Quest adaptation)** - Chest opening mechanics
   - **Effort:** 2 weeks
   - **Complexity:** Medium (requires chest system, stealing mechanics)

2. **Path Defense (Tower Defense)** - Strategic career tower placement
   - **Effort:** 3-4 weeks
   - **Complexity:** High (wave system, tower upgrades, pathing AI)

3. **Career Cafe** - Time management restaurant game
   - **Effort:** 2 weeks
   - **Complexity:** Medium (customer queue, recipe system)

4. **Career Factory** - Idle/clicker production game
   - **Effort:** 2 weeks
   - **Complexity:** Medium (automation, upgrade tree)

5. **Career Racing** - Competitive race with obstacles
   - **Effort:** 1-2 weeks
   - **Complexity:** Low (linear progression, power-ups)

**Remaining 8 modes:** Medium priority, implement based on user feedback

#### A1.3 Marketplace (Medium Priority)

**Current Status:** Database schema complete, zero UI
**Design Doc Reference:** Section 6 (Pathcte Market)
**Gap:** Students can earn tokens but can't spend them

**Required Components:**
- `MarketplacePage` with browsing grid
- `ItemCard` component showing price, preview, "owned" indicator
- `PurchaseModal` for confirming transactions
- `KeyPackAnimation` for opening packs
- Purchase service layer (already have DB function)
- Inventory management
- Daily deals system
- Gift sending (Plus feature)

**Estimated Effort:** 2 weeks
**Dependencies:** None (can implement independently)

#### A1.4 Polish & Enhancement Features (Lower Priority)

**Pathkey Unlock Animations**
- **Design Doc Reference:** Section 1.1 (Pathkeys System)
- **Gap:** Keys appear instantly; need celebration animations
- **Components:** Framer Motion animations, particle effects, sound effects
- **Effort:** 1 week

**Finn AI Assistant**
- **Design Doc Reference:** Section 1.3 (Career Profiles - Finn's Role)
- **Gap:** No AI tutor/guide present in UI
- **Components:** Chat interface, AI service integration (OpenAI/Claude API), context-aware prompts
- **Effort:** 3-4 weeks

**Career Video Player**
- **Design Doc Reference:** Section 1.3 (Career Profiles)
- **Gap:** Videos from O*NET not playable in-app
- **Components:** Video player component, Azure Media Services integration, transcript display
- **Effort:** 1 week

**Power-Ups in Gameplay**
- **Design Doc Reference:** Section 1.2 (Token Economy - Spending Tokens)
- **Gap:** Power-ups designed but not usable in games
- **Components:** Power-up inventory UI, in-game activation buttons, effect implementations
- **Effort:** 2 weeks per game mode

**Achievement System**
- **Gap:** No badge/achievement tracking beyond pathkeys
- **Components:** Achievement definition system, progress tracking, badge UI, notification system
- **Effort:** 2 weeks

**Social Features**
- **Gap:** No friend system, teams, or trading
- **Components:** Friend list, friend requests, team creation, pathkey trading system
- **Effort:** 3-4 weeks

---

### A2. Recommended Next Sprint Priorities

Based on the gap analysis and current completion status, here are the recommended implementation priorities:

#### Sprint 1: Teacher Empowerment (4-6 weeks)
**Goal:** Enable teachers to create and manage content

1. ✅ Question Set Creation Interface (Week 1-3)
   - CRUD operations for question sets
   - Question builder with image support
   - CSV import
   - Set metadata management

2. ✅ Basic Teacher Analytics (Week 4-5)
   - Post-game summary reports
   - Student participation view
   - CSV export for gradebooks

3. ✅ Question Discovery/Search (Week 6)
   - Browse community question sets
   - Preview before hosting
   - Favorite/bookmark sets

**Success Criteria:** Teachers can create custom content and run games end-to-end

---

#### Sprint 2: Marketplace & Monetization (2-3 weeks)
**Goal:** Complete the token economy loop

1. ✅ Marketplace Browsing UI (Week 1)
   - Grid layout for key packs
   - Filtering and sorting
   - Purchase modal

2. ✅ Pack Opening Experience (Week 2)
   - Animation for opening packs
   - Reveal sequence for pathkeys
   - Duplicate handling (convert to tokens)

3. ✅ Profile Customization Items (Week 3)
   - Avatar frames, backgrounds
   - Purchase and apply

**Success Criteria:** Students can earn tokens and spend them on pathkeys

---

#### Sprint 3: Game Mode Expansion (6-8 weeks)
**Goal:** Add variety to gameplay

1. ✅ Career Quest Mode (Week 1-2)
2. ✅ Career Cafe Mode (Week 3-4)
3. ✅ Career Factory Mode (Week 5-6)
4. ✅ Career Racing Mode (Week 7-8)

**Success Criteria:** 5 distinct game modes available for hosting

---

#### Sprint 4: Homework & Async Learning (3-4 weeks)
**Goal:** Support asynchronous assignments

1. ✅ Homework Creator UI (Week 1-2)
2. ✅ Student Homework Dashboard (Week 2-3)
3. ✅ LMS Integration Prep (Week 4)

**Success Criteria:** Teachers can assign homework with deadlines

---

#### Sprint 5: Polish & Launch Prep (3-4 weeks)
**Goal:** Production-ready quality

1. ✅ Animations & Transitions (Week 1)
2. ✅ Error Boundaries & Recovery (Week 1-2)
3. ✅ Performance Optimization (Week 2-3)
4. ✅ Testing Suite (Week 3-4)
5. ✅ Documentation & Onboarding (Week 4)

**Success Criteria:** App is stable, fast, and user-friendly

---

### A3. Features in Design Doc but Intentionally Deferred

**Mobile Apps (React Native)**
- **Reason:** Web MVP first; mobile in Phase 2 (Q2 2026)
- **Preparation:** Architecture already mobile-ready (shared package, platform-agnostic services)

**Parent Portal**
- **Reason:** Focus on teacher-student loop first
- **Timeline:** Phase 3 (Q3 2026)

**VR Career Experiences**
- **Reason:** Experimental; requires significant R&D
- **Timeline:** Phase 4 (Q4 2026)

**Advanced AI Features (Enhanced Finn)**
- **Reason:** Basic functionality first; AI enhancement later
- **Timeline:** Phase 4 (Q4 2026)

---

### A4. Technical Specifications Needed

The following technical details should be added to this implementation guide as features are prioritized:

1. **Question Set Editor API Specification**
   - Endpoint contracts for CRUD operations
   - Validation rules
   - Permission checks

2. **Homework System Data Model**
   - Extended schema for assignments
   - Completion tracking logic
   - Deadline enforcement

3. **Analytics Event Specification**
   - Event types to track
   - Event payload schemas
   - Aggregation queries

4. **Game Mode State Machines**
   - State diagrams for each mode
   - Transition logic
   - Win conditions

5. **Marketplace Transaction Flow**
   - Purchase workflow
   - Inventory management
   - Pack opening algorithm (rarity distribution)

---

**Document Version:** 1.1
**Last Updated:** October 27, 2025 (Added implementation status and gap analysis)
**Optimized For:** Claude Code AI Development
**Status:** In Active Development (35-40% Complete)

---

This implementation guide provides Claude Code with comprehensive, actionable instructions for building Pathcte. The new Implementation Status section tracks progress against the design document, and the Gap Analysis appendix identifies missing features with prioritization and effort estimates.
