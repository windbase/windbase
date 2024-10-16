import Providers from '@/providers';

import { Poppins } from 'next/font/google';

import './global.css';

export const metadata = {
  title: 'Windbase - Tailwind CSS Visual Builder',
  description:
    'Windbase is a visual builder for Tailwind CSS, enabling effortless UI design and code export',
};

const font = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
