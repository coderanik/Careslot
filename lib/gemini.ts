import "server-only";
import { GoogleGenAI } from "@google/genai";
import { requireEnv } from "./env";

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    // Function calling needs the v1beta API surface for Gemini Developer API keys.
    client = new GoogleGenAI({
      apiKey: requireEnv("GEMINI_API_KEY"),
      apiVersion: "v1beta",
    });
  }
  return client;
}
