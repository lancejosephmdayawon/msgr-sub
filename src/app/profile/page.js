"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user profile from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || "");
          setPhotoURL(data.photoURL || "");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveProfile = async () => {
    if (!displayName.trim()) {
      alert("Display name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { displayName, photoURL });
      alert("Profile updated!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Profile</h1>

      {photoURL && (
        <div className="flex justify-center mb-4">
          <img
            src={photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      )}

      <label className="block mb-2 font-medium">Display Name</label>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2 font-medium">Photo URL</label>
      <input
        type="text"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
        placeholder="Enter image URL"
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        onClick={saveProfile}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
      >
        Save
      </button>
    </div>
  );
}
