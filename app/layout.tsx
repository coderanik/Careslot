import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./landing.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareSlot · Clinic Booking Agent",
  description:
    "Book, move or cancel clinic appointments in plain English. Gemini function calling + Supabase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} min-h-screen font-sans antialiased`}>{children}</body>
    </html>
  );
}
