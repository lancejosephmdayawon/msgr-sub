"use client";
import { useState } from "react";
import ContactsList from "../../components/ContactsList";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen bg-white">
      <ContactsList onSelectContact={setSelectedContact} />
      {selectedContact ? (
        <ChatWindow contact={selectedContact} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
}
