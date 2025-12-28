// Physical AI Textbook - Better Auth API Handler (Vercel Serverless Function)
import { auth } from "../../src/lib/auth";

// Export handler for Vercel Edge/Serverless
export const GET = auth.handler;
export const POST = auth.handler;

// Required for Vercel Serverless Functions
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
