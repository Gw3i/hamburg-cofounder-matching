import { createClient } from "@supabase/supabase-js";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type SupabaseUser = {
  id: string;
  email?: string;
  accessToken: string;
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: SupabaseUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Extract Supabase access token from Authorization header
  const authHeader = opts.req.headers.authorization;
  let user: SupabaseUser | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const accessToken = authHeader.substring(7);

    // Verify token with Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (!error && data.user) {
        user = {
          id: data.user.id,
          email: data.user.email,
          accessToken,
        };
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
