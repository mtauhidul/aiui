import Link from "next/link";
import { AgentDemo } from "@/components/agent-demo";
import { ChatDemo } from "@/components/chat-demo";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">aiui</h1>
        <p className="text-muted-foreground">
          Minimal, modern UI components for AI applications.
        </p>
        <Link href="/docs/button" className="inline-block pt-2 text-sm underline underline-offset-4">Browse components →</Link>
      </header>
      <ChatDemo />
      <AgentDemo />
    </main>
  );
}
