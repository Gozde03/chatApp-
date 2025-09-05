// src/Chat.jsx
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9)); // Her kullanıcıya rastgele id

  // Firestore'dan mesajları gerçek zamanlı olarak dinle
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  // Mesaj gönderme
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      userId: userId,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-4 border-4 border-yellow-400 rounded-lg bg-gray-900 shadow-lg flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg) => {
            const isMine = msg.userId === userId;
            return (
              <div
                key={msg.id}
                className={`my-2 p-3 max-w-[70%] rounded-lg break-words
                  ${isMine 
                    ? "bg-pink-500 text-white ml-auto" 
                    : "bg-gray-900 text-white border-2 border-pink-500 mr-auto"}`}
              >
                {msg.text}
              </div>
            );
          })}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 rounded-lg hover:bg-pink-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
