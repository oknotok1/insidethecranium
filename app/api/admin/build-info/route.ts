import { NextResponse } from "next/server";

// This timestamp is set at build time
const BUILD_TIMESTAMP = new Date().toISOString();

export async function GET() {
  return NextResponse.json({
    buildTime: BUILD_TIMESTAMP,
    // Vercel provides these env vars at build time
    deploymentUrl: process.env.VERCEL_URL || "localhost",
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "unknown",
    environment: process.env.VERCEL_ENV || "development",
  });
}
