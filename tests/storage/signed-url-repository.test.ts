import { describe, it, expect, beforeEach } from "@jest/globals";
import { SignedUrlRepository } from "@/server/db/repo/signedUrl.repository";
import { db } from "@/server/db/drizzleDb";
import { signedUrls } from "@/server/db/schema/storage";
import { resolve } from "path";
import { testLogger } from "@/lib/testlogger";
import { config } from "dotenv";

// Load test environment
config({ path: resolve(__dirname, "../../.env.test") });

// Validate DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  testLogger.error("DATABASE_URL is not set in .env.test");
  process.exit(1);
}

// Run migrations
const { runMigrations } = await import("@/server/db/scripts/migrate");

await (async () => {
  try {
    testLogger.info("🔧 Running migrations on test database");
    await runMigrations(false);
    testLogger.info("✓ Migrations completed successfully");
  } catch (err) {
    testLogger.error("Migration failed:", err);
    process.exit(1);
  }
})();

// Helper function to create test signed URL data
function createTestSignedUrlData(
  overrides: Partial<{
    id: string;
    filePath: string;
    contentType: string;
    fileSize: bigint;
    contentMd5: string;
    expiresAt: Date;
    createdAt: Date;
    used: boolean;
  }> = {}
) {
  return {
    id: overrides.id || "test-token",
    filePath: overrides.filePath || "public/test.txt",
    contentType: overrides.contentType || "text/plain",
    fileSize: overrides.fileSize || BigInt(1024),
    contentMd5: overrides.contentMd5 || "abc123",
    expiresAt: overrides.expiresAt || new Date(Date.now() + 3600000),
    createdAt: overrides.createdAt || new Date(),
    used: overrides.used ?? false,
  };
}

describe("Signed URL Repository", () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.delete(signedUrls);
  });

  describe("createSignedUrl", () => {
    it("should create a new signed URL entry", async () => {
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      const data = createTestSignedUrlData({
        id: "test-token-123",
        filePath: "public/test.txt",
        contentType: "text/plain",
        fileSize: BigInt(1024),
        contentMd5: "abc123",
        expiresAt,
      });

      const result = await SignedUrlRepository.createSignedUrl(data);

      expect(result.id).toBe("test-token-123");
      expect(result.filePath).toBe("public/test.txt");
      expect(result.contentType).toBe("text/plain");
      expect(result.fileSize).toBe(BigInt(1024));
      expect(result.contentMd5).toBe("abc123");
      expect(result.used).toBe(false);
      expect(result.expiresAt.getTime()).toBe(expiresAt.getTime());
    });

    it("should create multiple signed URLs with different IDs", async () => {
      const expiresAt = new Date(Date.now() + 3600000);

      const url1 = await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "token-1",
          filePath: "public/file1.txt",
          fileSize: BigInt(100),
          contentMd5: "md5-1",
          expiresAt,
        })
      );

      const url2 = await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "token-2",
          filePath: "public/file2.txt",
          fileSize: BigInt(200),
          contentMd5: "md5-2",
          expiresAt,
        })
      );

      expect(url1.id).toBe("token-1");
      expect(url2.id).toBe("token-2");
      expect(url1.filePath).toBe("public/file1.txt");
      expect(url2.filePath).toBe("public/file2.txt");
    });
  });

  describe("getSignedUrlById", () => {
    it("should retrieve a signed URL by ID", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "retrieve-test",
          filePath: "public/retrieve.txt",
          fileSize: BigInt(512),
          contentMd5: "retrieve-md5",
          expiresAt,
        })
      );

      const result = await SignedUrlRepository.getSignedUrlById("retrieve-test");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("retrieve-test");
      expect(result?.filePath).toBe("public/retrieve.txt");
      expect(result?.used).toBe(false);
    });

    it("should return null for non-existent ID", async () => {
      const result = await SignedUrlRepository.getSignedUrlById("non-existent");
      expect(result).toBeNull();
    });

    it("should retrieve used signed URLs", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "used-token",
          filePath: "public/used.txt",
          fileSize: BigInt(256),
          contentMd5: "used-md5",
          expiresAt,
          used: true,
        })
      );

      const result = await SignedUrlRepository.getSignedUrlById("used-token");

      expect(result).not.toBeNull();
      expect(result?.used).toBe(true);
    });
  });

  describe("claimSignedUrl - Atomic Operations", () => {
    it("should claim a valid unused token successfully", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "claim-test",
          filePath: "public/claim.txt",
          fileSize: BigInt(128),
          contentMd5: "claim-md5",
          expiresAt,
        })
      );

      const result = await SignedUrlRepository.claimSignedUrl("claim-test");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("claim-test");
      expect(result?.used).toBe(true);

      // Verify it's marked as used in database
      const dbToken = await SignedUrlRepository.getSignedUrlById("claim-test");
      expect(dbToken?.used).toBe(true);
    });

    it("should return null for already used token", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "already-used",
          filePath: "public/used.txt",
          fileSize: BigInt(128),
          contentMd5: "used-md5",
          expiresAt,
        })
      );

      // Claim once
      const firstClaim = await SignedUrlRepository.claimSignedUrl("already-used");
      expect(firstClaim).not.toBeNull();

      // Try to claim again
      const secondClaim = await SignedUrlRepository.claimSignedUrl("already-used");
      expect(secondClaim).toBeNull();
    });

    it("should return null for expired token", async () => {
      const expiresAt = new Date(Date.now() - 3600000); // 1 hour ago
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "expired-token",
          filePath: "public/expired.txt",
          fileSize: BigInt(128),
          contentMd5: "expired-md5",
          expiresAt,
        })
      );

      const result = await SignedUrlRepository.claimSignedUrl("expired-token");
      expect(result).toBeNull();

      // Verify it's still marked as unused in database
      const dbToken = await SignedUrlRepository.getSignedUrlById("expired-token");
      expect(dbToken?.used).toBe(false);
    });

    it("should return null for non-existent token", async () => {
      const result = await SignedUrlRepository.claimSignedUrl("does-not-exist");
      expect(result).toBeNull();
    });

    it("should handle concurrent claim attempts (race condition)", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "race-token",
          filePath: "public/race.txt",
          fileSize: BigInt(128),
          contentMd5: "race-md5",
          expiresAt,
        })
      );

      // Simulate concurrent claims
      const [result1, result2, result3] = await Promise.all([
        SignedUrlRepository.claimSignedUrl("race-token"),
        SignedUrlRepository.claimSignedUrl("race-token"),
        SignedUrlRepository.claimSignedUrl("race-token"),
      ]);

      // Only one should succeed
      const results = [result1, result2, result3];
      const successCount = results.filter(r => r !== null).length;
      const failureCount = results.filter(r => r === null).length;

      expect(successCount).toBe(1);
      expect(failureCount).toBe(2);

      // Verify the token is marked as used
      const dbToken = await SignedUrlRepository.getSignedUrlById("race-token");
      expect(dbToken?.used).toBe(true);
    });
  });

  describe("deleteExpired", () => {
    it("should delete expired tokens", async () => {
      const now = Date.now();

      // Create expired tokens
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "expired-1",
          filePath: "public/exp1.txt",
          fileSize: BigInt(100),
          contentMd5: "exp1-md5",
          expiresAt: new Date(now - 7200000), // 2 hours ago
        })
      );

      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "expired-2",
          filePath: "public/exp2.txt",
          fileSize: BigInt(100),
          contentMd5: "exp2-md5",
          expiresAt: new Date(now - 3600000), // 1 hour ago
        })
      );

      // Create valid token
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "valid-token",
          filePath: "public/valid.txt",
          fileSize: BigInt(100),
          contentMd5: "valid-md5",
          expiresAt: new Date(now + 3600000), // 1 hour from now
        })
      );

      const deletedCount = await SignedUrlRepository.deleteExpired();

      expect(deletedCount).toBe(2);

      // Verify expired tokens are gone
      const exp1 = await SignedUrlRepository.getSignedUrlById("expired-1");
      const exp2 = await SignedUrlRepository.getSignedUrlById("expired-2");
      expect(exp1).toBeNull();
      expect(exp2).toBeNull();

      // Verify valid token still exists
      const valid = await SignedUrlRepository.getSignedUrlById("valid-token");
      expect(valid).not.toBeNull();
    });

    it("should return 0 when no expired tokens exist", async () => {
      const expiresAt = new Date(Date.now() + 3600000);
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "future-token",
          filePath: "public/future.txt",
          fileSize: BigInt(100),
          contentMd5: "future-md5",
          expiresAt,
        })
      );

      const deletedCount = await SignedUrlRepository.deleteExpired();
      expect(deletedCount).toBe(0);

      // Verify token still exists
      const token = await SignedUrlRepository.getSignedUrlById("future-token");
      expect(token).not.toBeNull();
    });

    it("should delete expired tokens regardless of used status", async () => {
      const now = Date.now();

      // Create expired used token
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "expired-used",
          filePath: "public/exp-used.txt",
          fileSize: BigInt(100),
          contentMd5: "exp-used-md5",
          expiresAt: new Date(now - 3600000),
          used: true,
        })
      );

      // Create expired unused token
      await SignedUrlRepository.createSignedUrl(
        createTestSignedUrlData({
          id: "expired-unused",
          filePath: "public/exp-unused.txt",
          fileSize: BigInt(100),
          contentMd5: "exp-unused-md5",
          expiresAt: new Date(now - 3600000),
        })
      );

      const deletedCount = await SignedUrlRepository.deleteExpired();
      expect(deletedCount).toBe(2);

      // Verify both are deleted
      const used = await SignedUrlRepository.getSignedUrlById("expired-used");
      const unused = await SignedUrlRepository.getSignedUrlById("expired-unused");
      expect(used).toBeNull();
      expect(unused).toBeNull();
    });

    it("should handle cleanup of large batches of expired tokens", async () => {
      const now = Date.now();
      const expiredTokens = 50;

      // Create many expired tokens
      const createPromises = [];
      for (let i = 0; i < expiredTokens; i++) {
        createPromises.push(
          SignedUrlRepository.createSignedUrl(
            createTestSignedUrlData({
              id: `batch-expired-${i}`,
              filePath: `public/batch-${i}.txt`,
              fileSize: BigInt(100),
              contentMd5: `batch-md5-${i}`,
              expiresAt: new Date(now - 3600000),
            })
          )
        );
      }
      await Promise.all(createPromises);

      const deletedCount = await SignedUrlRepository.deleteExpired();
      expect(deletedCount).toBe(expiredTokens);
    });
  });
});
