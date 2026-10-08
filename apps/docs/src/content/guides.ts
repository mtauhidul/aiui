export type Guide = { slug: string; title: string; description: string };

export const guides: Guide[] = [
  { slug: "getting-started", title: "Getting started", description: "Add your first component to a React project and have a working chat input in a few minutes." },
  { slug: "theming", title: "Theming", description: "The color tokens the components read, and how to change them." },
  { slug: "ai-sdk", title: "Use with the AI SDK", description: "Wire the components to the Vercel AI SDK: streaming text, reasoning and tool calls." },
  { slug: "accessibility", title: "Accessibility", description: "Keyboard shortcuts, screen-reader behavior and how the components are tested." },
];
