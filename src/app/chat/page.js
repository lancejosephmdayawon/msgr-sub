"use client";

import { useState } from "react";
import ContactsList from "../../components/ContactsList";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen bg-white">
      {/* CONTACTS LIST */}
      <div
        className={`${
          selectedContact ? "hidden md:block" : "block"
        } w-full md:w-1/3 border-r border-gray-200`}
      >
        <ContactsList onSelectContact={setSelectedContact} />
      </div>

      {/* CHAT WINDOW */}
      <div
        className={`flex-1 ${
          selectedContact ? "block" : "hidden md:block"
        }`}
      >
        {selectedContact ? (
          <ChatWindow
            contact={selectedContact}
            onBack={() => setSelectedContact(null)} // back button for mobile
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-gray-400">
            Select a contact to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
}
