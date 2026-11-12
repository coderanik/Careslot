"use client";

import { useEffect, useRef } from "react";
import type { AgentStep } from "@/lib/agent/types";
import { useChat } from "@/components/ChatContext";

const SAMPLE_PROMPTS = [
  "I have a skin rash, book me with a doctor on Friday morning.",
  "Move my appointment to the next free slot.",
  "Which Tamil-speaking doctors are free tomorrow?",
  "What medicine should I take for this rash?",
];

export default function AgentChat({ onDataChanged }: { onDataChanged?: () => void }) {
  const { messages, input, setInput, loading, error, ready, sendMessage, clearHistory, userId } =
    useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend(text: string) {
    sendMessage(text, onDataChanged);
  }

  function formatTime(timestamp?: number) {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="surface flex h-[min(74vh,720px)] flex-col overflow-hidden">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
<<<<<<< HEAD
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">Booking chat</h2>
              {messages.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Saved
                </span>
              )}
            </div>
=======
            <h2 className="text-base font-bold tracking-tight">Booking chat</h2>
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Plain English in. Gemini chooses the tools. History is automatically saved.
            </p>
          </div>
<<<<<<< HEAD
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] transition hover:bg-white hover:text-[var(--danger)]"
                title="Clear conversation history and start fresh"
              >
                Clear chat
              </button>
            )}
            <span className="hidden rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent)] sm:inline">
              Patient {userId}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5">
        {!ready && <p className="text-sm text-[var(--muted)]">Restoring your conversation…</p>}

        {ready && messages.length === 0 && (
=======
          <span className="hidden rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)] sm:inline">
            Signed-in patient
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--bg)]/50 px-4 py-5 md:px-5">
        {messages.length === 0 && (
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--muted)]">Try a demo prompt</p>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
<<<<<<< HEAD
                onClick={() => handleSend(p)}
                className="block w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-left text-sm leading-relaxed text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
=======
                onClick={() => send(p)}
                className="block w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left text-sm leading-relaxed text-[var(--ink)] shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow)]"
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={m.id || i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user" ? "max-w-[85%]" : "max-w-[92%] space-y-2"}>
              {m.steps && m.steps.length > 0 && <ToolSteps steps={m.steps} />}
              <div
                className={
                  m.role === "user"
                    ? "rounded-2xl rounded-br-md bg-[var(--accent)] px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)]"
                    : "whitespace-pre-wrap rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-4 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-sm)]"
                }
              >
                {m.text}
              </div>
              {m.timestamp && (
                <div
                  className={`px-1 text-[10px] text-[var(--muted)] ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(m.timestamp)}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="ml-1">Working through tools…</span>
          </div>
        )}
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2 border-t border-[var(--line)] bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
<<<<<<< HEAD
          placeholder={ready ? "Describe what you need…" : "Restoring your conversation…"}
          disabled={!ready || loading}
          className="flex-1 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!ready || loading || !input.trim()}
          className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
=======
          placeholder="Describe what you need…"
          className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
>>>>>>> 1c981e47484ad694291124653d6ef526d7475e3c
        >
          Send
        </button>
      </form>
    </div>
  );
}

function ToolSteps({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="space-y-1.5">
      {steps.map((s, i) => (
        <details
          key={i}
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs shadow-[var(--shadow-sm)]"
        >
          <summary className="cursor-pointer select-none">
            <span className={s.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}>
              {s.ok ? "Done" : "Failed"}
            </span>
            {" · "}
            <span className="font-mono font-semibold">{s.tool}</span>
            {s.writes && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                writes
              </span>
            )}
          </summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[var(--muted)]">
            {JSON.stringify(
              { args: s.args, ...(s.ok ? { result: s.result } : { error: s.error }) },
              null,
              2
            )}
          </pre>
        </details>
      ))}
    </div>
  );
}
