import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Firestore'dan mesajları gerçek zamanlı olarak dinle
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Mesaj gönderme
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="border p-4 h-96 overflow-y-scroll mb-4 bg-gray-100 rounded">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 border-b">
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
