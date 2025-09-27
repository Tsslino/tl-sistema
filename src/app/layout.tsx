import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // <-- Import CSS aqui

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TL Sistema de Automação',
  description: 'Controle de Colaboradores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}