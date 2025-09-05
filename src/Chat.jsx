import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="flex justify-center w-full">
        <div
          className="bg-white p-6 flex flex-col w-[400px] max-h-[70vh]"
        >
          <div className="flex flex-col gap-2 overflow-y-auto mb-4 items-center">
            {messages.map((msg) => {
              return (
                <div
                  key={msg.id}
                  className="p-3 max-w-[70%] break-words"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  {msg.text}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
            />
            <button
              type="submit"
              className="px-4 rounded-xl"
              style={{ backgroundColor: "#cdff69", color: "black" }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
