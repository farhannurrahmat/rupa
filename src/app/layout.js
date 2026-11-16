import "./globals.css";

export const metadata = {
  title: "Rupa",
  description: "Tempat karya menemukan penontonnya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}