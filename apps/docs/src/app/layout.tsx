import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";
import { REGISTRY_URL } from "@/lib/registry-url";
import { SiteHeader } from "@/components/site-header";
import { Lattice, fade } from "@/components/patterns";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = "Minimal, accessible UI components for chat, agents and tool use. Copy them into your project.";

export const metadata: Metadata = {
  metadataBase: new URL(REGISTRY_URL),
  title: { default: "aiui — UI components for AI applications", template: "%s — aiui" },
  description,
  openGraph: { title: "aiui", description, type: "website" },
  twitter: { card: "summary_large_image", title: "aiui", description },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#000000" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="flex min-h-full flex-col pt-[61px]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="relative flex flex-1 flex-col">
          {/* Faint lattice in the gutters either side of the content column, on wide screens only. */}
          <Lattice className="inset-y-0 left-0 hidden w-[calc(50%-620px)] min-[1320px]:block" s={26} opacity={0.075} mask={fade.vertical} />
          <Lattice className="inset-y-0 right-0 hidden w-[calc(50%-620px)] min-[1320px]:block" s={26} opacity={0.075} mask={fade.vertical} />
          {/* Faint vertical rails that mark the content column. */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[1240px] -translate-x-1/2 border-x border-white/[0.06] lg:block" />
          {children}
        </div>
      </body>
    </html>
  );
}
