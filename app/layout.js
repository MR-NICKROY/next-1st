import { Outfit } from "next/font/google";
import "./globals.css";

const Outfits = Outfit({
  subsets: ["latin"],
  weights: [400, 500, 600, 700],
});

export const metadata = {
  title: "Blog app",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${Outfits.variable} antialiased`}>{children}</body>
    </html>
  );
}
