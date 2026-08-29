import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GlobalEffects } from "@/components/GlobalEffects";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "vps.howtoselfhost.com — Cloud VPS Hosting",
    template: "%s | vps.howtoselfhost.com",
  },
  description:
    "High-end Cloud VPS hosting for a fair price. Spin up your VPS in minutes with NVMe storage, DDoS protection, and full root access.",
  keywords: ["vps", "cloud hosting", "self-hosting", "nvme", "linux", "server", "vps hosting"],
  authors: [{ name: "howtoselfhost.com" }],
  creator: "howtoselfhost.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vps.howtoselfhost.com",
    siteName: "vps.howtoselfhost.com",
    title: "vps.howtoselfhost.com — Cloud VPS Hosting",
    description: "High-end Cloud VPS hosting for a fair price. NVMe storage, DDoS protection, root access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "vps.howtoselfhost.com — Cloud VPS Hosting",
    description: "High-end Cloud VPS hosting for a fair price. NVMe storage, DDoS protection, root access.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen font-sans flex flex-col bg-background text-foreground transition-colors duration-200">
        <GlobalEffects />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="howtoselfhost-theme"
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
