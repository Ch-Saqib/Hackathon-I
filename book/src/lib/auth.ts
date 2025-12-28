// Physical AI Textbook - Better Auth Server Configuration
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      softwareSkills: {
        type: "string[]",
        required: false,
        defaultValue: [],
      },
      hardwareInventory: {
        type: "string[]",
        required: false,
        defaultValue: [],
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://hackathon-i-steel.vercel.app",
  ],
});

export type Auth = typeof auth;
