import AppShell from "@/components/AppShell";
import { ChatProvider } from "@/components/ChatContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
    </ChatProvider>
  );
}
