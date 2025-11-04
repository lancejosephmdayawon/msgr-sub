"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      // 1️⃣ Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Check if user doc exists
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      // 3️⃣ Only create the doc if it's new
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || user.email.split("@")[0],
          email: user.email,
          photoURL: user.photoURL || "",
        });
      }

      // 4️⃣ Redirect to chat
      router.push("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={login}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
      >
        Login
      </button>
    </div>
  );
}
