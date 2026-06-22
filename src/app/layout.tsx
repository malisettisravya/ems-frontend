import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
         

        <main>{children}</main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}