import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client using anon key with RLS policies
// This respects Row Level Security, which is the recommended approach
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "[Supabase] Missing credentials. Database operations will fail."
      );
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

// Create an authenticated Supabase client for a specific user
export function getSupabaseClientForUser(accessToken: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "[Supabase] Missing credentials. Database operations will fail."
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

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

// Database operations using RLS-protected client
export async function getFounderProfileByUserId(
  userId: string
): Promise<FounderProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("founder_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] Error fetching profile:", error);
    throw new Error(error.message);
  }

  // Update last_active_at timestamp when profile is viewed
  if (data) {
    await supabase
      .from("founder_profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("user_id", userId);
  }

  return data;
}

export async function upsertFounderProfile(
  accessToken: string,
  profile: InsertFounderProfile
): Promise<void> {
  const supabase = getSupabaseClientForUser(accessToken);
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { error } = await supabase.from("founder_profiles").upsert(
    {
      user_id: profile.user_id,
      name: profile.name,
      age: profile.age,
      current_occupation: profile.current_occupation,
      time_commitment: profile.time_commitment,
      is_technical: profile.is_technical,
      has_idea: profile.has_idea,
      skill_areas: profile.skill_areas,
      idea: profile.idea,
      looking_for: profile.looking_for,
      skills: profile.skills,
      linked_in: profile.linked_in,
      photo_url: profile.photo_url,
      profile_completed: profile.profile_completed ?? true,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("[Supabase] Error upserting profile:", error);
    throw new Error(error.message);
  }
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

export async function getAllFounderProfiles(
  params?: PaginationParams
): Promise<FounderProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from("founder_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply pagination if provided
  if (params?.limit) {
    query = query.limit(params.limit);
  }
  if (params?.offset) {
    query = query.range(
      params.offset,
      params.offset + (params.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Error fetching profiles:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getFounderProfilesWithPagination(
  params: PaginationParams = {}
): Promise<PaginatedResponse<FounderProfile>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      data: [],
      total: 0,
      limit: params.limit || 20,
      offset: params.offset || 0,
      hasMore: false,
    };
  }

  const limit = params.limit || 20;
  const offset = params.offset || 0;

  // Get total count
  const { count, error: countError } = await supabase
    .from("founder_profiles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("[Supabase] Error counting profiles:", countError);
    throw new Error(countError.message);
  }

  const total = count || 0;

  // Get paginated data
  const { data, error } = await supabase
    .from("founder_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[Supabase] Error fetching profiles:", error);
    throw new Error(error.message);
  }

  return {
    data: data || [],
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

export async function getTotalProfileCount(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("founder_profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[Supabase] Error counting profiles:", error);
    throw new Error(error.message);
  }

  return count || 0;
}

export async function uploadProfilePhoto(
  accessToken: string,
  userId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseClientForUser(accessToken);
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  // Create unique file path
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = fileName.split(".").pop();
  const filePath = `${userId}/${timestamp}-${randomStr}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("profile-photos")
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("[Supabase] Error uploading photo:", error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFounderProfile(
  accessToken: string,
  userId: string
): Promise<void> {
  const supabase = getSupabaseClientForUser(accessToken);
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  // First, get the profile to check for photo_url
  const { data: profile } = await supabase
    .from("founder_profiles")
    .select("photo_url")
    .eq("user_id", userId)
    .single();

  // Delete profile photo from storage if it exists
  if (profile?.photo_url) {
    try {
      // Extract file path from URL
      const url = new URL(profile.photo_url);
      const pathParts = url.pathname.split("/profile-photos/");
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from("profile-photos").remove([filePath]);
      }
    } catch (error) {
      console.error("[Supabase] Error deleting profile photo:", error);
      // Continue with profile deletion even if photo deletion fails
    }
  }

  // Delete the profile record
  const { error } = await supabase
    .from("founder_profiles")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[Supabase] Error deleting profile:", error);
    throw new Error(error.message);
  }

  console.log(`[Supabase] Successfully deleted profile for user ${userId}`);
}
