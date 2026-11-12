"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { AgentResult, AgentStep } from "@/lib/agent/types";

export type Message = {
  id?: string;
  role: "user" | "model";
  text: string;
  steps?: AgentStep[];
  timestamp?: number;
};

type ChatContextType = {
  messages: Message[];
  input: string;
  loading: boolean;
  error: string;
  ready: boolean;
  userId: string;
  setInput: (value: string) => void;
  sendMessage: (text: string, onDataChanged?: () => void) => Promise<void>;
  clearHistory: () => void;
};

type Snapshot = {
  messages: Message[];
  revision: number;
};

const ChatContext = createContext<ChatContextType | null>(null);

const STORAGE_PREFIX = "careslot_chat_history_";
const APPOINTMENTS_EVENT = "appointments-changed";
const APPOINTMENTS_STORAGE_KEY = "careslot_appointments_updated";

const memoryByUser = new Map<string, Snapshot>();
const storeListeners = new Set<() => void>();

export function notifyDataChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(APPOINTMENTS_EVENT));
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, Date.now().toString());
    } catch {}
  }
}

function getStorageKey(uid: string) {
  return `${STORAGE_PREFIX}${uid || "P001"}`;
}

function parseStored(raw: string): Snapshot {
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) {
    const revision = parsed.reduce((max: number, message: Message) => {
      return Math.max(max, message?.timestamp || 0);
    }, 0);
    return { messages: parsed as Message[], revision };
  }
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { messages?: unknown }).messages)
  ) {
    const record = parsed as { messages: Message[]; revision?: number };
    return { messages: record.messages, revision: record.revision || 0 };
  }
  return { messages: [], revision: 0 };
}

function readStorage(uid: string): Snapshot {
  if (typeof window === "undefined") return { messages: [], revision: 0 };
  try {
    const raw = localStorage.getItem(getStorageKey(uid));
    if (!raw) return { messages: [], revision: 0 };
    return parseStored(raw);
  } catch (err) {
    console.error("Failed to load chat history from localStorage", err);
    return { messages: [], revision: 0 };
  }
}

function readBest(uid: string): Snapshot {
  const memory = memoryByUser.get(uid);
  const stored = readStorage(uid);
  if (!memory) return stored;
  if (stored.revision > memory.revision) return stored;
  return memory;
}

function writeStorage(uid: string, snapshot: Snapshot) {
  if (typeof window === "undefined") return;
  const key = getStorageKey(uid);
  try {
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    try {
      const slim: Snapshot = {
        revision: snapshot.revision,
        messages: snapshot.messages.map(({ steps: _steps, ...message }) => message),
      };
      localStorage.setItem(key, JSON.stringify(slim));
    } catch (retryErr) {
      console.error("Failed to save chat history to localStorage", retryErr);
    }
  }
}

function publish(uid: string, messages: Message[]) {
  const snapshot = { messages, revision: Date.now() };
  memoryByUser.set(uid, snapshot);
  writeStorage(uid, snapshot);
  storeListeners.forEach((listener) => listener());
  return snapshot;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const messagesRef = useRef<Message[]>(messages);
  const revisionRef = useRef(0);
  const loadedUserRef = useRef("");
  const userIdRef = useRef(userId);
  messagesRef.current = messages;
  userIdRef.current = userId;

  function applySnapshot(snapshot: Snapshot) {
    revisionRef.current = snapshot.revision;
    messagesRef.current = snapshot.messages;
    setMessages(snapshot.messages);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setUserId(d?.user?.userId || "P001");
      })
      .catch(() => {
        if (!cancelled) setUserId("P001");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const snapshot = readBest(userId);
    memoryByUser.set(userId, snapshot);
    loadedUserRef.current = userId;
    applySnapshot(snapshot);
    setReady(true);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    function syncLatest(event?: Event) {
      if (loadedUserRef.current !== userId) return;
      if (event instanceof StorageEvent && event.key && event.key !== getStorageKey(userId)) return;
      const snapshot = readBest(userId);
      const memory = memoryByUser.get(userId);
      if (!memory || snapshot.revision >= memory.revision) {
        memoryByUser.set(userId, snapshot);
      }
      if (snapshot.revision < revisionRef.current) return;
      if (snapshot.revision === revisionRef.current && snapshot.messages === messagesRef.current) return;
      applySnapshot(snapshot);
    }

    storeListeners.add(syncLatest);
    window.addEventListener("storage", syncLatest);
    window.addEventListener("focus", syncLatest);
    document.addEventListener("visibilitychange", syncLatest);
    window.addEventListener("pageshow", syncLatest);

    return () => {
      storeListeners.delete(syncLatest);
      window.removeEventListener("storage", syncLatest);
      window.removeEventListener("focus", syncLatest);
      document.removeEventListener("visibilitychange", syncLatest);
      window.removeEventListener("pageshow", syncLatest);
    };
  }, [userId]);

  async function sendMessage(text: string, onDataChanged?: () => void) {
    const trimmed = text.trim();
    const uid = userIdRef.current;
    if (!trimmed || loading || !uid) return;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    const next: Message[] = [...messagesRef.current, userMsg];
    const sent = publish(uid, next);
    revisionRef.current = sent.revision;
    messagesRef.current = next;
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-20).map(({ role, text: messageText }) => ({
            role,
            text: messageText,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const result = data as AgentResult;

      const modelMsg: Message = {
        id: `model-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "model",
        text: result.reply,
        steps: result.steps,
        timestamp: Date.now(),
      };

      const updated = [...next, modelMsg];
      const saved = publish(uid, updated);
      revisionRef.current = saved.revision;
      messagesRef.current = updated;

      if (result.steps?.some((s) => s.writes && s.ok)) {
        notifyDataChanged();
        onDataChanged?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    const uid = userIdRef.current;
    if (!uid) return;
    const saved = publish(uid, []);
    revisionRef.current = saved.revision;
    messagesRef.current = [];
    setError("");
    notifyDataChanged();
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        loading,
        error,
        ready,
        userId,
        setInput,
        sendMessage,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
