"use client";

import * as React from "react";
import { Plan, type PlanStep } from "@/registry/ui/plan";
import { Trace, type TraceEvent } from "@/registry/ui/trace";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { Artifact } from "@/registry/ui/artifact";
import { CodeBlock } from "@/registry/ui/code-block";

const STEPS: PlanStep[] = [
  { id: "1", title: "Search the codebase", state: "done" },
  { id: "2", title: "Draft the migration", state: "done", detail: "3 files changed" },
  { id: "3", title: "Run the migration on production", state: "active", detail: "Waiting for approval" },
  { id: "4", title: "Verify and report", state: "pending" },
];

const EVENTS: TraceEvent[] = [
  { id: "a", kind: "agent", name: "agent.run", start: 0, duration: 4200 },
  { id: "b", kind: "retrieval", name: "search_code", start: 120, duration: 640 },
  { id: "c", kind: "llm", name: "claude-sonnet", start: 800, duration: 1900 },
  { id: "d", kind: "tool", name: "write_file", start: 2750, duration: 310 },
  { id: "e", kind: "tool", name: "run_migration", start: 3100, duration: 1000, status: "error" },
];

const CODE = `export function Hello() {\n  return <h1>Hello, world</h1>;\n}`;

const cap = "mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground";

export function AgentDemo() {
  const [status, setStatus] = React.useState<"pending" | "approved" | "denied">("pending");
  return (
    <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-2 [&>*]:min-w-0 [&>*]:bg-surface/80">
      <div className="space-y-8 p-6">
        <div>
          <p className={cap}>Plan</p>
          <Plan steps={STEPS} />
        </div>
        <div>
          <p className={cap}>Approval</p>
          <ApprovalPrompt
            title="Run migration on production?"
            description="This will modify the users table."
            details="ALTER TABLE users ADD COLUMN plan text;"
            status={status}
            onApprove={() => setStatus("approved")}
            onDeny={() => setStatus("denied")}
          />
        </div>
        <div>
          <p className={cap}>Trace</p>
          <Trace events={EVENTS} />
        </div>
      </div>
      <div className="flex flex-col p-6">
        <p className={cap}>Artifact</p>
        <Artifact
          className="min-h-[22rem] flex-1"
          title="Hello.tsx"
          preview={<h1 className="font-display text-4xl tracking-tight">Hello, <em>world</em></h1>}
          code={<CodeBlock code={CODE} lang="tsx" />}
        />
      </div>
    </div>
  );
}
