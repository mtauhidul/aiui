import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

/**
 * A fake model so the template runs without an API key. It streams canned replies:
 *  - "weather ..." calls the getWeather tool, then answers with the result
 *  - "fail ..." or "error ..." throws, so you can see the error state and retry
 *  - anything else streams some reasoning and a markdown answer with a code block
 * Replace it with a real model by setting AI_GATEWAY_API_KEY.
 */

const usage = {
  inputTokens: { total: 12, noCache: 12, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 48, text: 48, reasoning: 0 },
};

const REASONING = "The user is trying out the template. I will answer briefly and include a small code example.";

const ANSWER = `Here is a short answer, streamed token by token.

- Messages, reasoning and tool calls are separate parts.
- Markdown is split into blocks, so finished blocks never re-render.

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

Try asking about the **weather** to see a tool call, or type **fail** to see the error state.`;

/** Splits text into small pieces so the stream looks like real tokens. */
function pieces(text: string) {
  return text.match(/\S+\s*|\s+/g) ?? [];
}

type PromptMessage = { role: string; content: unknown };

function lastUserText(prompt: PromptMessage[]) {
  for (let i = prompt.length - 1; i >= 0; i--) {
    const message = prompt[i];
    if (message.role !== "user" || !Array.isArray(message.content)) continue;
    return message.content
      .map((part: { type: string; text?: string }) => (part.type === "text" ? part.text : ""))
      .join(" ");
  }
  return "";
}

export function createDemoModel() {
  return new MockLanguageModelV4({
    provider: "turn-demo",
    modelId: "demo",
    doStream: async ({ prompt }) => {
      const messages = prompt as PromptMessage[];
      const last = messages[messages.length - 1];
      const text = lastUserText(messages);

      // Second step of a tool call: the tool result is the last message.
      if (last?.role === "tool") {
        const answer = "It is 21°C and clear. That came from the getWeather tool, which this demo fakes.";
        return {
          stream: simulateReadableStream({
            chunkDelayInMs: 30,
            chunks: [
              { type: "stream-start" as const, warnings: [] },
              { type: "text-start" as const, id: "t1" },
              ...pieces(answer).map((delta) => ({ type: "text-delta" as const, id: "t1", delta })),
              { type: "text-end" as const, id: "t1" },
              { type: "finish" as const, usage, finishReason: { unified: "stop" as const, raw: "stop" } },
            ],
          }),
        };
      }

      if (/\b(fail|error)\b/i.test(text)) throw new Error("Demo error: the model did not respond in time.");

      if (/weather/i.test(text)) {
        const city = /in ([A-Za-z ]+?)[?.!]*$/i.exec(text.trim())?.[1] ?? "Berlin";
        return {
          stream: simulateReadableStream({
            chunkDelayInMs: 250,
            chunks: [
              { type: "stream-start" as const, warnings: [] },
              {
                type: "tool-call" as const,
                toolCallId: "call_weather",
                toolName: "getWeather",
                input: JSON.stringify({ city }),
              },
              { type: "finish" as const, usage, finishReason: { unified: "tool-calls" as const, raw: "tool_calls" } },
            ],
          }),
        };
      }

      return {
        stream: simulateReadableStream({
          chunkDelayInMs: 28,
          initialDelayInMs: 600,
          chunks: [
            { type: "stream-start" as const, warnings: [] },
            { type: "reasoning-start" as const, id: "r1" },
            ...pieces(REASONING).map((delta) => ({ type: "reasoning-delta" as const, id: "r1", delta })),
            { type: "reasoning-end" as const, id: "r1" },
            { type: "text-start" as const, id: "t1" },
            ...pieces(ANSWER).map((delta) => ({ type: "text-delta" as const, id: "t1", delta })),
            { type: "text-end" as const, id: "t1" },
            { type: "finish" as const, usage, finishReason: { unified: "stop" as const, raw: "stop" } },
          ],
        }),
      };
    },
  });
}
