import { QueryProvider } from "@/libs/providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampHub",
  description: "A platform to rent and manage camping gear with ease.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}