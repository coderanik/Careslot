"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentResult, AgentStep } from "@/lib/agent/types";

type Message = { role: "user" | "model"; text: string; steps?: AgentStep[] };

const SAMPLE_PROMPTS = [
  "I have a skin rash, book me with a doctor on Friday morning.",
  "Move my appointment to the next free slot.",
  "Which Tamil-speaking doctors are free tomorrow?",
];

export default function AgentChat({ onDataChanged }: { onDataChanged?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-20).map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const result = data as AgentResult;
      setMessages([...next, { role: "model", text: result.reply, steps: result.steps }]);
      if (result.steps.some((s) => s.writes && s.ok)) onDataChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass panel flex h-[min(74vh,720px)] flex-col overflow-hidden">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Booking chat</h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Plain English in. Gemini chooses the tools. You see every call.
            </p>
          </div>
          <span className="hidden rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent)] sm:inline">
            Patient P001
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--muted)]">Try a demo prompt</p>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="block w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-left text-sm leading-relaxed text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user" ? "max-w-[85%]" : "max-w-[92%] space-y-2"}>
              {m.steps && m.steps.length > 0 && <ToolSteps steps={m.steps} />}
              <div
                className={
                  m.role === "user"
                    ? "rounded-[22px] rounded-br-md bg-[var(--ink)] px-4 py-2.5 text-sm leading-relaxed text-white"
                    : "whitespace-pre-wrap rounded-[22px] rounded-bl-md border border-[var(--line)] bg-white/70 px-4 py-2.5 text-sm leading-relaxed"
                }
              >
                {m.text}
              </div>
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
          send(input);
        }}
        className="flex gap-2 border-t border-[var(--line)] bg-white/40 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you need…"
          className="flex-1 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
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
          className="rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-2 text-xs"
        >
          <summary className="cursor-pointer select-none">
            <span className={s.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}>
              {s.ok ? "Done" : "Failed"}
            </span>
            {" · "}
            <span className="font-mono font-medium">{s.tool}</span>
            {s.writes && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
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
