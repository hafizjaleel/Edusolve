import './globals.css';

export const metadata = {
  title: 'Edusolve',
  description: 'Education Hub Management System'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
