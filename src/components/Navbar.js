"use client";

import Link from "next/link";
import { auth, db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link href="/chat">Messenger Neptify</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && profile ? (
          <>
            {/* Profile link */}
            <Link href="/profile" className="flex items-center gap-2">
              <img
                src={profile.photoURL || "/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{profile.displayName || profile.email}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/"
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
