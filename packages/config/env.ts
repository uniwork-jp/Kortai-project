import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_LIFF_ID: z.string(),
});

export const env = envSchema.parse(process.env);

export const FIREBASE_EMULATOR = {
  authHost: "http://localhost:9099",
  firestoreHost: "localhost:8080",
  functionsHost: "http://localhost:5001",
};
