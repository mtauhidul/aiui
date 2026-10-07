"use client";

import * as React from "react";
import { Plan, type PlanStep } from "@/registry/ui/plan";
import { Trace, type TraceEvent } from "@/registry/ui/trace";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { Artifact } from "@/registry/ui/artifact";
import { ToolCall } from "@/registry/ui/tool-call";
import { CodeBlock } from "@/registry/ui/code-block";

type Status = "pending" | "approved" | "denied";

const stepsFor = (status: Status): PlanStep[] => [
  { id: "1", title: "Search the codebase", state: "done" },
  { id: "2", title: "Draft the migration", state: "done", detail: "3 files changed" },
  {
    id: "3",
    title: "Run the migration on production",
    state: status === "approved" ? "done" : status === "denied" ? "error" : "active",
    detail: status === "approved" ? "Applied in 1.0s" : status === "denied" ? "Denied by you" : "Waiting for approval",
  },
  { id: "4", title: "Verify and report", state: status === "approved" ? "active" : "pending" },
];

const BASE_EVENTS: TraceEvent[] = [
  { id: "b", kind: "retrieval", name: "search_code", start: 120, duration: 640 },
  { id: "c", kind: "llm", name: "claude-sonnet", start: 800, duration: 1900 },
  { id: "d", kind: "tool", name: "write_file", start: 2750, duration: 310 },
];

const eventsFor = (status: Status): TraceEvent[] => [
  { id: "a", kind: "agent", name: "agent.run", start: 0, duration: status === "approved" ? 4200 : 3100 },
  ...BASE_EVENTS,
  ...(status === "approved" ? [{ id: "e", kind: "tool" as const, name: "run_migration", start: 3100, duration: 1000 }] : []),
];

const CODE = `export function Hello() {\n  return <h1>Hello, world</h1>;\n}`;

const cap = "mb-3 text-[14px] text-muted-foreground";

export function AgentDemo() {
  const [status, setStatus] = React.useState<Status>("pending");
  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-2 lg:divide-x [&>*]:min-w-0">
      <div className="space-y-8 p-6">
        <div>
          <p className={cap}>Plan</p>
          <Plan steps={stepsFor(status)} />
        </div>
        <div>
          <p className={cap}>Approval</p>
          <ApprovalPrompt
            title="Run migration on production?"
            description="This will modify the users table."
            details="ALTER TABLE users ADD COLUMN plan text;"
            risk="high"
            status={status}
            onApprove={() => setStatus("approved")}
            onDeny={() => setStatus("denied")}
          />
        </div>
        <div>
          <p className={cap}>Tool call</p>
          <ToolCall
            name="run_migration"
            state={status === "approved" ? "success" : status === "denied" ? "error" : "pending"}
            duration={status === "approved" ? "1.0s" : undefined}
            input={{ sql: "ALTER TABLE users ADD COLUMN plan text;", env: "production" }}
            output={status === "approved" ? { rows_affected: 0, ok: true } : undefined}
            error={status === "denied" ? "Denied by user" : undefined}
          />
        </div>
        <div>
          <p className={cap}>Trace</p>
          <Trace events={eventsFor(status)} />
        </div>
      </div>
      <div className="flex flex-col p-6">
        <p className={cap}>Artifact</p>
        <Artifact
          className="min-h-[22rem] flex-1"
          title="Hello.tsx"
          preview={<p className="text-3xl font-[360] tracking-[-0.02em]">hello, <span className="text-faint">world</span></p>}
          code={<CodeBlock code={CODE} lang="tsx" />}
        />
      </div>
    </div>
  );
}
