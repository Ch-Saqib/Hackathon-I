// Physical AI Textbook - Better Auth API Handler (Vercel Serverless Function)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

// Convert Better Auth handler to Vercel serverless format
const handler = toNodeHandler(auth);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
