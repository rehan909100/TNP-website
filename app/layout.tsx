import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TNP Placement Control Room",
  description: "Interactive placement dashboard for the 2025–26 season.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
