import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts safely
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
});

// Page metadata (SEO title/description)
export const metadata: Metadata = {
  title: "AI Career Mentor Agent",
  description: "Get a personalized career roadmap with AI.",
};

// Layout structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      {/* 👇 This prevents hydration mismatch warnings caused by browser extensions like Grammarly */}
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
