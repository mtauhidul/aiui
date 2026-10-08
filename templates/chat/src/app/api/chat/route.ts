import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createDemoModel } from "@/lib/demo-model";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Without a key the app uses a fake model, so it runs out of the box.
  const demo = !process.env.AI_GATEWAY_API_KEY;
  const model = demo ? createDemoModel() : (process.env.MODEL ?? "anthropic/claude-sonnet-5.5");

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    tools: {
      getWeather: tool({
        description: "Get the current weather for a city",
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => ({ city, temperature: 21, unit: "C", conditions: "clear" }),
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: true,
      // The SDK hides error details from the browser by default. Say only what is safe to show:
      // the demo's own message, or a generic one for real provider errors.
      onError: (error) =>
        demo && error instanceof Error ? error.message : "The model request failed. Please try again.",
    }),
  });
}
