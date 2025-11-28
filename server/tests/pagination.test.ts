import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Pagination Tests - November 2025 Best Practices
 *
 * Tests server-side pagination for profile list
 */

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Profile List Pagination", () => {
  describe("profile.list with pagination", () => {
    it("should return paginated response with default limit and offset", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({});

      // Should have pagination structure
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("offset");
      expect(result).toHaveProperty("hasMore");

      // Default values
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);

      // Data should be an array
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should respect custom limit parameter", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({
        limit: 5,
      });

      expect(result.limit).toBe(5);
      expect(result.data.length).toBeLessThanOrEqual(5);
    });

    it("should respect custom offset parameter", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({
        offset: 10,
      });

      expect(result.offset).toBe(10);
    });

    it("should calculate hasMore correctly", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({
        limit: 5,
        offset: 0,
      });

      // If total > limit, should have more
      if (result.total > 5) {
        expect(result.hasMore).toBe(true);
      } else {
        expect(result.hasMore).toBe(false);
      }
    });

    it("should return empty data for offset beyond total", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({
        offset: 999999,
      });

      expect(result.data).toEqual([]);
      expect(result.hasMore).toBe(false);
    });

    it("should enforce maximum limit of 100", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // Try to request more than max limit
      await expect(
        caller.profile.list({
          limit: 150, // Exceeds max of 100
        })
      ).rejects.toThrow();
    });

    it("should enforce minimum limit of 1", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // Try to request less than min limit
      await expect(
        caller.profile.list({
          limit: 0,
        })
      ).rejects.toThrow();
    });

    it("should enforce minimum offset of 0", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // Try negative offset
      await expect(
        caller.profile.list({
          offset: -1,
        })
      ).rejects.toThrow();
    });

    it("should filter out current user when provided", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      // Get all profiles first
      const allProfiles = await caller.profile.list({});

      if (allProfiles.data.length > 0) {
        const firstUserId = allProfiles.data[0]?.user_id;

        // Request with current user filter
        const filtered = await caller.profile.list({
          currentUserSupabaseId: firstUserId,
        });

        // Should not include the filtered user
        const hasFilteredUser = filtered.data.some(
          p => p.user_id === firstUserId
        );
        expect(hasFilteredUser).toBe(false);
      }
    });

    it("should maintain consistent total count across pages", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const page1 = await caller.profile.list({
        limit: 5,
        offset: 0,
      });

      const page2 = await caller.profile.list({
        limit: 5,
        offset: 5,
      });

      // Total should be the same across pages
      expect(page1.total).toBe(page2.total);
    });

    it("should return profiles in descending order by created_at", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.list({
        limit: 10,
      });

      if (result.data.length >= 2) {
        const first = new Date(result.data[0]!.created_at);
        const second = new Date(result.data[1]!.created_at);

        // First profile should be created after or at the same time as second
        expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
      }
    });
  });
});
