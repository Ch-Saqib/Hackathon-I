// Physical AI Textbook - Better Auth API Handler (Vercel Serverless Function)
import { auth } from "../../src/lib/auth";

// Handle all Better Auth routes
export const GET = auth.handler;
export const POST = auth.handler;
