import { Chat } from "@/components/chat";

export default function Page() {
  return <Chat demo={!process.env.AI_GATEWAY_API_KEY} />;
}
