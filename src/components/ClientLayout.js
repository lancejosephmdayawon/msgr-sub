"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="p-4">{children}</main>
    </>
  );
}
