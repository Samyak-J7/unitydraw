import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UnityDraw",
  description: "Realtime Collaborative Whiteboard",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
    <html lang="en">
      <body className={inter.className}>
      
      {children}
      <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
