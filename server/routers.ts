import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { TRPCError } from "@trpc/server";
import * as supabaseDb from "./supabaseServer";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Founder profile operations
  profile: router({
    // Public endpoint - anyone can view profiles
    get: publicProcedure
      .input(z.object({ 
        supabaseId: z.string(),
      }))
      .query(async ({ input }) => {
        const profile = await supabaseDb.getFounderProfileByUserId(input.supabaseId);
        return profile;
      }),

    // Protected endpoint - users can only modify their own profile
    upsert: protectedProcedure
      .input(z.object({
        supabaseId: z.string(),
        email: z.string().email(),
        name: z.string().min(1),
        age: z.number().min(1).max(150).nullable().optional(),
        current_occupation: z.enum(["student", "working_full_time", "working_part_time_on_idea", "working_full_time_on_idea", "between_jobs"]),
        time_commitment: z.enum(["full_time", "part_time", "exploring"]),
        is_technical: z.boolean(),
        has_idea: z.boolean(),
        skill_areas: z.array(z.string()),
        idea: z.string().optional(),
        looking_for: z.string().optional(),
        skills: z.string().optional(),
        linked_in: z.string().url().optional().or(z.literal('')),
        photo_url: z.string().optional(),
        profile_completed: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Authorization check: user can only modify their own profile
        if (input.supabaseId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only modify your own profile',
          });
        }

        // Use access token from authenticated context
        await supabaseDb.upsertFounderProfile(ctx.user.accessToken, {
          user_id: ctx.user.id,
          name: input.name,
          age: input.age ?? null,
          current_occupation: input.current_occupation,
          time_commitment: input.time_commitment,
          is_technical: input.is_technical,
          has_idea: input.has_idea,
          skill_areas: input.skill_areas,
          idea: input.idea,
          looking_for: input.looking_for,
          skills: input.skills,
          linked_in: input.linked_in,
          photo_url: input.photo_url,
          profile_completed: input.profile_completed ?? true,
        });

        return { success: true };
      }),

    // Protected endpoint - users can only upload their own photos
    uploadPhoto: protectedProcedure
      .input(z.object({
        userId: z.string(),
        photoData: z.string().max(10_000_000), // ~7MB base64 limit
        mimeType: z.string()
      }))
      .mutation(async ({ input, ctx }) => {
        // Authorization check: user can only upload their own photo
        if (input.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only upload your own photo',
          });
        }

        // Extract base64 data from data URL
        const base64Data = input.photoData.split(',')[1] || input.photoData;
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Generate filename from userId and timestamp
        const timestamp = Date.now();
        const extension = input.mimeType.split('/')[1];
        const fileName = `${ctx.user.id}-${timestamp}.${extension}`;
        
        // Upload to Supabase Storage using authenticated context
        const url = await supabaseDb.uploadProfilePhoto(
          ctx.user.accessToken,
          ctx.user.id,
          fileName,
          buffer,
          input.mimeType
        );
        
        return { url };
      }),

    // Public endpoint - anyone can view list of profiles
    list: publicProcedure
      .input(z.object({
        currentUserSupabaseId: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }))
      .query(async ({ input }) => {
        const result = await supabaseDb.getFounderProfilesWithPagination({
          limit: input.limit,
          offset: input.offset,
        });
        
        // Filter out current user if provided
        if (input.currentUserSupabaseId) {
          result.data = result.data.filter(p => p.user_id !== input.currentUserSupabaseId);
          // Adjust total count if current user was filtered out
          if (result.data.length < input.limit && result.hasMore) {
            result.total = Math.max(0, result.total - 1);
          }
        }
        
        return result;
      }),

    // Protected endpoint - users can only delete their own profile
    delete: protectedProcedure
      .input(z.object({
        supabaseId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Authorization check: user can only delete their own profile
        if (input.supabaseId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only delete your own profile',
          });
        }

        // Delete profile and all associated data (GDPR right to erasure)
        await supabaseDb.deleteFounderProfile(ctx.user.accessToken, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
