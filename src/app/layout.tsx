import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Analytics } from "@vercel/analytics/react"

const outfit = Outfit({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Hyper Docs",
  description: "Real time collaborative texteditor",
  icons:{
    icon: "/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={outfit.className}
      >
        <NuqsAdapter>
          <ConvexClientProvider>
          <Toaster />
          {children}
          </ConvexClientProvider>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
