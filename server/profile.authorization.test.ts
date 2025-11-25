import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

/**
 * Authorization Tests - November 2025 Best Practices
 * 
 * Tests that users can only access and modify their own data
 */

function createMockContext(userId: string): TrpcContext {
  return {
    user: {
      id: userId,
      email: `${userId}@example.com`,
      accessToken: 'mock-access-token',
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Profile Authorization", () => {
  describe("profile.upsert", () => {
    it("should allow user to update their own profile", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This test verifies authorization passes (doesn't throw FORBIDDEN)
      // Note: Will fail at Supabase level with mock token, but that's expected
      // We're testing authorization logic, not Supabase integration
      try {
        await caller.profile.upsert({
          supabaseId: userId,
          email: "user@example.com",
          name: "Test User",
          current_occupation: "student",
          time_commitment: "full_time",
          is_technical: true,
          has_idea: false,
          skill_areas: ["business"],
        });
      } catch (error: any) {
        // Should NOT be a FORBIDDEN error (authorization passed)
        expect(error.code).not.toBe('FORBIDDEN');
      }
    });

    it("should prevent user from updating another user's profile", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const otherUserId = "660e8400-e29b-41d4-a716-446655440001"; // Different valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This should throw FORBIDDEN - user is trying to update someone else's profile
      try {
        await caller.profile.upsert({
          supabaseId: otherUserId, // Different user ID
          email: "other@example.com",
          name: "Other User",
          current_occupation: "student",
          time_commitment: "full_time",
          is_technical: true,
          has_idea: false,
          skill_areas: ["business"],
        });
        // Should not reach here
        expect.fail('Expected FORBIDDEN error');
      } catch (error: any) {
        // Should be a FORBIDDEN error
        expect(error.code).toBe('FORBIDDEN');
        expect(error.message).toContain('only modify your own profile');
      }
    });

    it("should prevent unauthenticated users from updating profiles", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // This should throw UNAUTHORIZED - no user in context
      try {
        await caller.profile.upsert({
          supabaseId: userId,
          email: "user@example.com",
          name: "Test User",
          current_occupation: "student",
          time_commitment: "full_time",
          is_technical: true,
          has_idea: false,
          skill_areas: ["business"],
        });
        // Should not reach here
        expect.fail('Expected UNAUTHORIZED error');
      } catch (error: any) {
        // Should be an UNAUTHORIZED error
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe("profile.uploadPhoto", () => {
    it("should allow user to upload their own photo", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This test verifies authorization passes (doesn't throw FORBIDDEN)
      try {
        await caller.profile.uploadPhoto({
          userId,
          photoData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          mimeType: "image/png",
        });
      } catch (error: any) {
        // Should NOT be a FORBIDDEN error (authorization passed)
        expect(error.code).not.toBe('FORBIDDEN');
      }
    });

    it("should prevent user from uploading photo for another user", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const otherUserId = "660e8400-e29b-41d4-a716-446655440001"; // Different valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This should throw FORBIDDEN - user is trying to upload for someone else
      try {
        await caller.profile.uploadPhoto({
          userId: otherUserId, // Different user ID
          photoData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          mimeType: "image/png",
        });
        // Should not reach here
        expect.fail('Expected FORBIDDEN error');
      } catch (error: any) {
        // Should be a FORBIDDEN error
        expect(error.code).toBe('FORBIDDEN');
        expect(error.message).toContain('only upload your own photo');
      }
    });

    it("should prevent unauthenticated users from uploading photos", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // This should throw UNAUTHORIZED - no user in context
      try {
        await caller.profile.uploadPhoto({
          userId,
          photoData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          mimeType: "image/png",
        });
        // Should not reach here
        expect.fail('Expected UNAUTHORIZED error');
      } catch (error: any) {
        // Should be an UNAUTHORIZED error
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe("profile.delete", () => {
    it("should allow user to delete their own profile", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This test verifies authorization passes (doesn't throw FORBIDDEN)
      try {
        await caller.profile.delete({
          supabaseId: userId,
        });
      } catch (error: any) {
        // Should NOT be a FORBIDDEN error (authorization passed)
        expect(error.code).not.toBe('FORBIDDEN');
      }
    });

    it("should prevent user from deleting another user's profile", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const otherUserId = "660e8400-e29b-41d4-a716-446655440001"; // Different valid UUID
      const ctx = createMockContext(userId);
      const caller = appRouter.createCaller(ctx);

      // This should throw FORBIDDEN - user is trying to delete someone else's profile
      try {
        await caller.profile.delete({
          supabaseId: otherUserId, // Different user ID
        });
        // Should not reach here
        expect.fail('Expected FORBIDDEN error');
      } catch (error: any) {
        // Should be a FORBIDDEN error
        expect(error.code).toBe('FORBIDDEN');
        expect(error.message).toContain('only delete your own profile');
      }
    });

    it("should prevent unauthenticated users from deleting profiles", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // This should throw UNAUTHORIZED - no user in context
      try {
        await caller.profile.delete({
          supabaseId: userId,
        });
        // Should not reach here
        expect.fail('Expected UNAUTHORIZED error');
      } catch (error: any) {
        // Should be an UNAUTHORIZED error
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe("profile.get (public)", () => {
    it("should allow anyone to view profiles", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // This should not throw - profile.get is public
      // Note: Will return null if profile doesn't exist, which is expected
      await expect(
        caller.profile.get({
          supabaseId: userId,
        })
      ).resolves.toBeDefined();
    });
  });

  describe("profile.list (public)", () => {
    it("should allow anyone to list profiles", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // This should not throw - profile.list is public
      await expect(
        caller.profile.list({})
      ).resolves.toBeDefined();
    });
  });
});
