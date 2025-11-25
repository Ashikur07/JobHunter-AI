import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // নতুন ফাইল ইম্পোর্ট

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Job Hunter AI",
  description: "Track your job applications automatically",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* পুরো অ্যাপকে AuthProvider দিয়ে মুড়িয়ে দিলাম */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}