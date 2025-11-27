/**
 * Type definitions for Supabase database operations and founder profiles
 */

// Types for founder profiles
export interface FounderProfile {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  current_occupation:
    | "student"
    | "working_full_time"
    | "working_part_time_on_idea"
    | "working_full_time_on_idea"
    | "between_jobs"
    | null;
  time_commitment: "full_time" | "part_time" | "exploring" | null;
  is_technical: boolean | null;
  has_idea: boolean | null;
  skill_areas: string[] | null;
  idea: string | null;
  looking_for: string | null;
  skills: string | null;
  linked_in: string | null;
  photo_url: string | null;
  profile_completed: boolean | null;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface InsertFounderProfile {
  user_id: string;
  name: string;
  age?: number | null;
  current_occupation:
    | "student"
    | "working_full_time"
    | "working_part_time_on_idea"
    | "working_full_time_on_idea"
    | "between_jobs";
  time_commitment: "full_time" | "part_time" | "exploring";
  is_technical: boolean;
  has_idea: boolean;
  skill_areas: string[];
  idea?: string | null;
  looking_for?: string | null;
  skills?: string | null;
  linked_in?: string | null;
  photo_url?: string | null;
  profile_completed?: boolean;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
