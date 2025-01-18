import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timetable AI",
  description: "An AI-powered tool to simplify your scheduling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-mainbg text-white`}
      >
        {/* Header */}
        <header className="w-full py-6 bg-header shadow-md">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange">
              <Link href="/">Timetable AI</Link>
            </h1>
            <nav className="space-x-6 hidden md:flex">
              <Link href="/#features" className="text-orange hover:text-white">
                Features
              </Link>
              <Link href="/generate" className="text-orange hover:text-white">
                Generate
              </Link>
              <Link href="/about" className="text-orange hover:text-white">
                About
              </Link>
              <Link href="/#contact" className="text-orange hover:text-white">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="w-full py-10 bg-header text-center">
          <h2 className="text-xl font-bold text-orange">Contact Us</h2>
          <p className="mt-4 text-gray-300">
            Have questions? Reach out to us at{" "}
            <a
              href="mailto:support@timetableai.com"
              className="text-orange hover:underline"
            >
              support@timetableai.com
            </a>
          </p>
          <p className="mt-2 text-gray-300">© 2025 Timetable AI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
