import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { sitemapUrl } from "@/lib/seo";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitemapUrl()),
  title: {
    default: "Aashish Kumar Jha — Registered Civil Engineer",
    template: "%s | Aashish Kumar Jha",
  },
  description:
    "Registered Civil Engineer and Lecturer specialising in land & water resources engineering. NEC Registered Engineer [78836], Janakpur, Nepal.",
  keywords: [
    "Aashish Kumar Jha",
    "Civil Engineer Nepal",
    "Registered Engineer",
    "Lecturer",
    "Water Resources Engineering",
    "Irrigation",
    "Janakpur",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: sitemapUrl(),
    siteName: "Aashish Kumar Jha",
    title: "Aashish Kumar Jha — Registered Civil Engineer",
    description:
      "Engineering sustainable water solutions, shaping future engineers. NEC Registered Engineer [78836].",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Aashish Kumar Jha" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashish Kumar Jha — Registered Civil Engineer",
    description:
      "Engineering sustainable water solutions, shaping future engineers. NEC Registered Engineer [78836].",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#071527" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}