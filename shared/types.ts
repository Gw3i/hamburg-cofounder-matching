/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

// Drizzle schema removed - using Supabase now
export * from "./_core/errors";

// Feedback types
export interface Feedback {
  id: number;
  user_id: string | null;
  content: string;
  created_at: string;
  status: "unread" | "read";
}

export interface CreateFeedbackInput {
  content: string;
}

export interface FeedbackResponse {
  success: boolean;
  id?: number;
  error?: string;
}
