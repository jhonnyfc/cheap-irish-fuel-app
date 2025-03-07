import type { Metadata } from "next";
import localFont from "next/font/local";
import "../shared/styles/globals.css";

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
  description: `Find the Cheapest Diesel and Unleaded Fuel Prices in Ireland with CheapIrishFuel.info
Save money on fuel with CheapIrishFuel.info, your trusted platform for finding the best diesel and unleaded
fuel prices in Ireland. Our site offers real-time updates on diesel and unleaded fuel costs at petrol stations
across the country, allowing you to easily compare prices and locate the cheapest fuel options near you.
Whether you're driving a diesel or unleaded vehicle, CheapIrishFuel.info helps you make smarter decisions
about where to refuel. From daily commutes to long road trips, our user-friendly platform lets you track the latest
fuel prices and identify the best stations to save on every fill-up.
Take control of your fuel budget today with our interactive fuel map and up-to-date station details,
tailored to help drivers find the lowest prices on diesel and unleaded fuel across Ireland.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://cheapirishfuel.info/" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
