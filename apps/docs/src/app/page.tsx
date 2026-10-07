import { AgentDemo } from "@/components/agent-demo";
import { ChatDemo } from "@/components/chat-demo";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">aiui</h1>
        <p className="text-muted-foreground">
          Minimal, modern UI components for AI applications.
        </p>
      </header>
      <ChatDemo />
      <AgentDemo />
    </main>
  );
}
