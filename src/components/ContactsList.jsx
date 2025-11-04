"use client";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../utils/firebase";

export default function ContactsList({ onSelectContact }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const currentUser = auth.currentUser;
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.uid !== currentUser?.uid);
      setContacts(users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-3">Contacts</h2>
      {contacts.map(user => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => onSelectContact(user)}
        >
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span>{user.displayName || "Unnamed User"}</span>
        </div>
      ))}
    </div>
  );
}
