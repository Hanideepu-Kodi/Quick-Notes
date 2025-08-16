import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quick Notes",
  description: "Personal notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-950 text-slate-100 antialiased">
        {/* Soft layered radial gradients */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(40rem 30rem at 10% 10%, rgba(59,130,246,0.08), transparent 60%)," +
              "radial-gradient(50rem 35rem at 90% 90%, rgba(56,189,248,0.08), transparent 60%)," +
              "radial-gradient(60rem 40rem at 50% 50%, rgba(168,85,247,0.06), transparent 60%)",
          }}
        />
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
