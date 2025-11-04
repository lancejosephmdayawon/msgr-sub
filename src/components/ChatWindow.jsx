"use client";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "../utils/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatWindow({ contact, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;
  const bottomRef = useRef(null);

  const chatId =
    currentUser && contact
      ? [currentUser.uid, contact.uid].sort().join("_")
      : null;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      chatId,
      senderId: currentUser.uid,
      receiverId: contact.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-4 border-b flex items-center gap-3 bg-white sticky top-0">
        {/* 🔙 Back (mobile only) */}
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
        >
          ⬅
        </button>

        <img
          src={contact.photoURL || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold truncate">
          {contact.displayName}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                msg.senderId === currentUser.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex items-center gap-2 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
