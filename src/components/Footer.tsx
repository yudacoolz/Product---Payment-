"use client";

import ChatPage from "./chat/Chat";
import { useState, useEffect } from "react";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="border p-2 w-full fixed bottom-0 bg-blue-50">
      <div className="flex items-center justify-end">
        <button onClick={() => setIsModalOpen(!isModalOpen)}>chat me</button>
      </div>
      {isModalOpen && <ChatPage />}
    </div>
  );
};

export default Footer;
