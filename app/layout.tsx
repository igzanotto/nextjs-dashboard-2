import { DM_Sans, Inter, Montserrat, Poppins, Libre_Baskerville } from "next/font/google";
import { Metadata } from 'next';
import "./globals.css";


const montserrat = Montserrat({subsets:["latin"], weight:["100", "200", "300", "400", "500"]})
const libreBaskerville = Libre_Baskerville({subsets:["latin"], weight:["400", "700"]})


export const metadata: Metadata = {
  title: "Tualo Dashboard",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}