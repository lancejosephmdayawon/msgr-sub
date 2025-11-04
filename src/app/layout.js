import "../styles/globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "Msgr Sub",
  description: "Next.js + Firebase Messenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
