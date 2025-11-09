/**
 * Database Types
 * Auto-generated TypeScript types for Supabase tables
 */

export type UserType = 'student' | 'teacher' | 'parent' | 'admin';
export type SubscriptionTier = 'free' | 'plus' | 'flex';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type PathkeyType = 'career' | 'skill' | 'industry' | 'milestone' | 'mystery';
export type QuestionType = 'multiple_choice' | 'true_false';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type BusinessDriver = 'people' | 'product' | 'pricing' | 'process' | 'proceeds' | 'profits';
export type GameMode =
  | 'career_quest'
  | 'path_defense'
  | 'career_clash'
  | 'mystery_path'
  | 'speed_run'
  | 'team_challenge'
  | 'tournament';
export type GameStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled';
export type SessionType = 'solo' | 'multiplayer';

// ============================================================================
// PROFILES
// ============================================================================

export interface Profile {
  id: string; // UUID, references auth.users
  user_type: UserType;
  username: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  tokens: number;
  created_at: string;
  updated_at: string;

  // Student specific
  grade_level: number | null;
  school_id: string | null;

  // Teacher specific
  subscription_tier: SubscriptionTier | null;
  subscription_expires_at: string | null;

  // Settings
  settings: Record<string, any>;
}

// ============================================================================
// SCHOOLS
// ============================================================================

export interface School {
  id: string;
  name: string;
  district: string | null;
  city: string | null;
  state: string | null;
  country: string;
  license_type: 'free' | 'school' | 'district' | null;
  max_students: number | null;
  max_teachers: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PATHKEYS
// ============================================================================

export interface Pathkey {
  id: string;
  key_code: string;
  name: string;
  description: string | null;
  rarity: Rarity;
  key_type: PathkeyType;
  career_id: string | null;

  // Visual
  image_url: string;
  image_url_animated: string | null;
  color_primary: string | null;
  color_secondary: string | null;

  // Metadata
  metadata: Record<string, any>;
  is_active: boolean;
  release_date: string | null;

  created_at: string;
  updated_at: string;
}

export interface UserPathkey {
  id: string;
  user_id: string;
  pathkey_id: string;
  acquired_at: string;
  quantity: number;
  is_favorite: boolean;
}

// ============================================================================
// CAREERS
// ============================================================================

export interface Career {
  id: string;
  onet_code: string | null;
  title: string;
  description: string | null;

  // Classification
  industry: string;
  sector: string;
  career_cluster: string | null;

  // Requirements
  education_level: string[] | null;
  certifications: string[] | null;
  skills: Record<string, any>;

  // Compensation
  salary_min: number | null;
  salary_max: number | null;
  salary_median: number | null;
  salary_currency: string;

  // Job Market
  growth_rate: number | null;
  job_outlook: string | null;
  employment_2023: number | null;
  employment_2033_projected: number | null;

  // Content
  day_in_life_text: string | null;
  video_url: string | null;
  tasks: string[] | null;
  work_environment: string | null;

  // Related
  related_careers: string[] | null;

  // Metadata
  content_last_updated: string | null;
  is_verified: boolean;
  metadata: Record<string, any>;

  created_at: string;
  updated_at: string;
}

// ============================================================================
// QUESTION SETS
// ============================================================================

export interface QuestionSet {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;

  // Classification
  subject: string;
  grade_level: number[] | null;
  career_sector: string | null;
  career_cluster: string | null; // CTE Career Cluster
  career_id: string | null; // Specific career UUID, or NULL for overview sets
  question_set_type: 'career_quest'; // All sets use career_quest type
  tags: string[] | null;

  // Status
  is_public: boolean;
  is_verified: boolean;

  // Stats
  times_played: number;
  average_score: number | null;
  total_questions: number;

  // Metadata
  thumbnail_url: string | null;
  difficulty_level: Difficulty | 'mixed' | null;

  created_at: string;
  updated_at: string;
}

export interface QuestionSetMembership {
  id: string;
  question_set_id: string;
  question_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_set_id: string;
  question_text: string;
  question_type: QuestionType;

  // Options format: [{text: string, is_correct: boolean}, ...]
  options: QuestionOption[];

  // Settings
  time_limit_seconds: number;
  points: number;

  // Media
  image_url: string | null;

  // Business Framework (6 P's)
  business_driver: BusinessDriver | null;

  // Metadata
  order_index: number;
  difficulty: Difficulty | null;

  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  text: string;
  is_correct: boolean;
}

// ============================================================================
// TOURNAMENTS
// ============================================================================

export type TournamentStatus = 'setup' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentStartMode = 'independent' | 'coordinated';
export type ProgressionMode = 'auto' | 'manual';

export interface Tournament {
  id: string;
  tournament_code: string;
  coordinator_id: string;
  title: string;
  description: string | null;
  question_set_id: string;
  status: TournamentStatus;
  max_classrooms: number;
  max_players_per_classroom: number;
  start_mode: TournamentStartMode;
  progression_mode: ProgressionMode;
  allow_late_join: boolean;
  settings: Record<string, any>;
  scheduled_start_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  school_name: string | null;
  grade_levels: number[] | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TournamentPlayerAggregate {
  tournament_id: string;
  user_id: string | null;
  display_name: string;
  classroom_name: string;
  game_session_id: string;
  player_id: string;
  total_score: number;
  total_correct: number;
  total_answers: number;
  tokens_earned: number;
  pathkeys_earned: string[] | null;
  classroom_placement: number | null;
  joined_at: string;
  is_connected: boolean;
}

export interface TournamentLeaderboardEntry extends TournamentPlayerAggregate {
  rank: number;
}

export interface ClassroomRanking {
  classroom_name: string;
  game_session_id: string;
  player_count: number;
  total_score: number;
  avg_score: number;
  rank: number;
}

// ============================================================================
// GAME SESSIONS
// ============================================================================

export interface GameSession {
  id: string;
  game_code: string;
  host_id: string;
  question_set_id: string;
  game_mode: GameMode;
  status: GameStatus;
  session_type: SessionType;
  current_question_index: number;

  // Tournament fields
  tournament_id: string | null;
  classroom_name: string | null;

  // Settings
  max_players: number;
  is_public: boolean;
  allow_late_join: boolean;

  // Timing
  started_at: string | null;
  ended_at: string | null;

  // Timer tracking (for Durable Functions)
  current_question_started_at: string | null;
  current_question_time_limit: number;

  // Metadata
  metadata: Record<string, any>;

  created_at: string;
  updated_at: string;
}

export interface GamePlayer {
  id: string;
  game_session_id: string;
  user_id: string | null;
  display_name: string;

  // Score tracking
  score: number;
  correct_answers: number;
  total_answers: number;

  // Status
  is_connected: boolean;
  placement: number | null;

  // Connection tracking (for Durable Functions)
  connection_status: 'active' | 'disconnected';
  last_seen_at: string;

  // Rewards
  tokens_earned: number;
  pathkeys_earned: string[] | null;

  // Timing
  joined_at: string;
  left_at: string | null;
}

export interface GameAnswer {
  id: string;
  game_session_id: string;
  player_id: string;
  question_id: string;

  // Answer
  selected_option_index: number;
  is_correct: boolean;

  // Timing
  time_taken_ms: number;
  points_earned: number;

  answered_at: string;
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export interface Achievement {
  id: string;
  key_code: string;
  name: string;
  description: string;
  category: 'collection' | 'social' | 'gameplay' | 'progression';
  tier: number;

  // Visual
  icon_url: string;
  color: string;

  // Requirements
  requirement_type: string;
  requirement_value: number;

  // Rewards
  tokens_reward: number;
  pathkey_rewards: string[] | null;

  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      schools: {
        Row: School;
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<School, 'id' | 'created_at'>>;
      };
      pathkeys: {
        Row: Pathkey;
        Insert: Omit<Pathkey, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Pathkey, 'id' | 'created_at'>>;
      };
      user_pathkeys: {
        Row: UserPathkey;
        Insert: Omit<UserPathkey, 'id' | 'acquired_at'>;
        Update: Partial<Omit<UserPathkey, 'id' | 'user_id' | 'pathkey_id'>>;
      };
      careers: {
        Row: Career;
        Insert: Omit<Career, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Career, 'id' | 'created_at'>>;
      };
      question_sets: {
        Row: QuestionSet;
        Insert: Omit<QuestionSet, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<QuestionSet, 'id' | 'created_at'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Question, 'id' | 'created_at'>>;
      };
      tournaments: {
        Row: Tournament;
        Insert: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tournament, 'id' | 'created_at'>>;
      };
      game_sessions: {
        Row: GameSession;
        Insert: Omit<GameSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GameSession, 'id' | 'created_at'>>;
      };
      game_players: {
        Row: GamePlayer;
        Insert: Omit<GamePlayer, 'id' | 'joined_at'>;
        Update: Partial<Omit<GamePlayer, 'id' | 'session_id'>>;
      };
      game_answers: {
        Row: GameAnswer;
        Insert: Omit<GameAnswer, 'id' | 'answered_at'>;
        Update: Partial<Omit<GameAnswer, 'id'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Achievement, 'id' | 'created_at'>>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id' | 'created_at'>;
        Update: Partial<Omit<UserAchievement, 'id' | 'user_id' | 'achievement_id'>>;
      };
    };
  };
}
