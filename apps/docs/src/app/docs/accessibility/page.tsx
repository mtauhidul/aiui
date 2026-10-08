import type { Metadata } from "next";
import Link from "next/link";
import { Guide, TableScroll, h2, p, code } from "@/components/guide";
import { guides } from "@/content/guides";
import { docs, groups } from "@/content/components";

const guide = guides.find((g) => g.slug === "accessibility")!;
export const metadata: Metadata = { title: guide.title, description: guide.description };

const keys: [string, string, string][] = [
  ["Prompt Composer", "Enter", "Send. Shift+Enter adds a line. Escape stops a running reply."],
  ["Slash Commands", "↑ ↓  Enter  Tab  Esc", "Move through the list, choose a command, close the menu."],
  ["Model Picker", "type  ↑ ↓  Enter  Esc", "Search, move, choose, close. Focus returns to the trigger."],
  ["Reasoning, Tool Call", "Enter  Space", "Expand or collapse."],
  ["Feedback", "Enter  Space  Esc  Ctrl/Cmd+Enter", "Rate, close the follow-up, submit the comment."],
  ["Attachment", "Tab  Enter  Space", "Reach a remove button and activate it. Focus moves to the next file."],
  ["Approval Prompt", "Tab  Enter  Space", "Reach Approve or Deny and activate."],
  ["Artifact", "← →  Enter", "Move between Preview and Code."],
  ["Scroll to Bottom, Suggestions, Copy Button", "Tab  Enter  Space", "Native buttons."],
];

export default function Accessibility() {
  return (
    <Guide slug={guide.slug}>
      <section className="space-y-4">
        <h2 className={h2}>how it is tested</h2>
        <ul className={`${p} list-disc space-y-1.5 pl-5`}>
          <li>Every component runs through axe in the automated test suite, along with tests for keyboard behavior, ARIA state and focus.</li>
          <li>The docs pages are checked with axe in a real browser, including color contrast, at desktop and phone widths.</li>
          <li>A test fails the build if any animation lacks a <span className={code}>prefers-reduced-motion</span> opt-out.</li>
          <li>Automated checks do not replace listening to the interface. We have not yet done full manual sessions with VoiceOver, NVDA and JAWS. If something sounds wrong, please open an issue.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>patterns used everywhere</h2>
        <ul className={`${p} list-disc space-y-1.5 pl-5`}>
          <li>
            <strong className="font-medium text-foreground">Conversation as a log.</strong> Put messages in a container with <span className={code}>role=&quot;log&quot;</span> and <span className={code}>aria-live=&quot;polite&quot;</span>. Set <span className={code}>aria-busy</span> while a reply streams so assistive technology waits for the finished message. Give the container <span className={code}>tabIndex=&#123;0&#125;</span> too: a log made only of text has no focusable content, so without it keyboard users cannot scroll it.
          </li>
          <li>
            <strong className="font-medium text-foreground">Speaker labels.</strong> Each message is prefixed with a screen-reader-only &quot;You said:&quot; or &quot;Assistant said:&quot;.
          </li>
          <li>
            <strong className="font-medium text-foreground">State is spoken, not only colored.</strong> Status, risk, errors and plan steps all have text. Color only reinforces it.
          </li>
          <li>
            <strong className="font-medium text-foreground">Focus is never dropped.</strong> When the focused control disappears (a removed attachment, a decided approval, a closed follow-up), focus moves to a sensible neighbor.
          </li>
          <li>
            <strong className="font-medium text-foreground">Reduced motion.</strong> Movement, scaling and looping animations stop. Color and opacity fades remain.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>keyboard</h2>
        <TableScroll label="Keyboard shortcuts by component">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-white/[0.03] text-left text-[14px] text-muted-foreground">
              <tr><th className="px-4 py-3 font-medium">component</th><th className="px-4 py-3 font-medium">keys</th><th className="px-4 py-3 font-medium">what they do</th></tr>
            </thead>
            <tbody>
              {keys.map(([name, k, what]) => (
                <tr key={name} className="border-t align-top">
                  <td className="px-4 py-3 text-foreground">{name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{k}</td>
                  <td className="px-4 py-3 text-muted-foreground">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>

      <section className="space-y-8">
        <h2 className={h2}>notes by component</h2>
        {groups.map((g) => (
          <div key={g} className="space-y-6">
            <h3 className="text-[15px] text-faint">{g.toLowerCase()}</h3>
            {docs.filter((d) => d.group === g).map((d) => (
              <div key={d.slug} className="space-y-2.5">
                <Link href={`/docs/${d.slug}`} className="text-[17px] text-foreground underline underline-offset-4 decoration-border outline-none hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring">
                  {d.title}
                </Link>
                <ul className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  {d.a11y.map((note) => (
                    <li key={note} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-faint" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </section>
    </Guide>
  );
}
