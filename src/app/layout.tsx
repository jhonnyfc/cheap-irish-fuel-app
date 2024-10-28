import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cheap Irish Fuel",
  description: `Discover the best fuel prices across Ireland with CheapIrishFuel.info!
  Our platform provides real-time updates on diesel and unleaded prices at petrol
  stations nationwide, helping you find the cheapest options near you. Whether you're
  looking to save on daily commutes or planning a road trip, CheapIrishFuel.info makes
  it easy to compare prices, find fuel stations, and track the latest trends in Irish fuel costs.
  Start saving on fuel today with our user-friendly, updated fuel map and station details tailored for drivers across Ireland!`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
