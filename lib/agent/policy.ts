/**
 * Deterministic safety gate that runs before Gemini.
 * Booking with a symptom mention is allowed; medical advice is refused with a clear reason.
 */

const MEDICAL_ADVICE =
  /\b(diagnos(e|is|ing)?|prescrib(e|ing)?|what\s+medicine|which\s+medicine|what\s+(pill|drug|tablet|antibiotic)|should\s+i\s+take|treat(ment|ing)?\s+me|is\s+this\s+(cancer|serious|fatal)|do\s+i\s+have|cure\s+my|medical\s+advice|what\s+test(s)?\s+should|interpret\s+(my\s+)?(lab|blood|report|symptoms?))\b/i;

const BOOKING_INTENT =
  /\b(book|appointment|slot|schedule|reschedule|cancel|doctor|dermatolog|available|free)\b/i;

export type PolicyDecision =
  | { ok: true }
  | { ok: false; reason: string; reply: string };

export function checkUserRequest(text: string): PolicyDecision {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      ok: false,
      reason: "Empty message",
      reply: "Please tell me what you need help booking.",
    };
  }

  // Pure medical-advice asks (no booking intent) are refused here with a clear reason.
  if (MEDICAL_ADVICE.test(trimmed) && !BOOKING_INTENT.test(trimmed)) {
    return {
      ok: false,
      reason: "Medical advice is outside CareSlot's booking-only rules",
      reply:
        "I can't diagnose conditions or suggest medicine, tests, or treatments — that breaks CareSlot's booking-only rule. I can help you book the right department instead. Which day works for you?",
    };
  }

  return { ok: true };
}
