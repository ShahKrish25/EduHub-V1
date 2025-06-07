import { Inter, Poppins, Roboto, Oxanium } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});
const oxanium = Oxanium({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-oxanium',
});

export const metadata = {
  title: "EduHub",
  description: "A student friendly site for getting all types of their academic resources and with context aware ai featurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.variable} ${roboto.variable} ${oxanium.variable}`}>
      <body>{children}</body>
    </html>
  );
}
