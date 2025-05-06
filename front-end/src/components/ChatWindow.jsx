import { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";

function ChatWindow({ surveyData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null); // for auto-scroll

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    console.log("📤 Sending to /ask-ai:", { question: input, surveyData });

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, surveyData }),
      });

      const data = await res.json();

      if (res.ok && data.answer) {
        setMessages([...newMessages, { from: "ai", text: data.answer }]);
      } else {
        const errorMsg = data?.error || "No response from AI.";
        console.error("⚠️ AI error response:", errorMsg);
        setMessages([...newMessages, { from: "ai", text: `⚠️ ${errorMsg}` }]);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setMessages([
        ...newMessages,
        { from: "ai", text: "❌ Network error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  // 🪄 Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`chat-window ${
        document.body.classList.contains("dark-mode") ? "dark-chat" : ""
      }`}
    >
      <h4>🧠 Ask the AI about this survey</h4>

      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="msg ai">Thinking...</div>}
      </div>

      <input
        placeholder="Ask about group trends, specific questions, or summary insights..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={loading}
      />
    </div>
  );
}

export default ChatWindow;


// import { useState } from "react";
// import "./ChatWindow.css";
//
// function ChatWindow({ surveyData }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//
//     const newMessages = [...messages, { from: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);
//
//     // 🧠 Log what is being sent to the backend
//     console.log("📤 Sending to /ask-ai:", {
//       question: input,
//       surveyData,
//     });
//
//     try {
//       const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/ask-ai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: input, surveyData }),
//       });
//
//       const data = await res.json();
//
//       if (res.ok && data.answer) {
//         setMessages([...newMessages, { from: "ai", text: data.answer }]);
//       } else {
//         const errorMsg = data?.error || "No response from AI.";
//         console.error("⚠️ AI error response:", errorMsg);
//         setMessages([...newMessages, { from: "ai", text: `⚠️ ${errorMsg}` }]);
//       }
//     } catch (err) {
//       console.error("❌ Network error:", err);
//       setMessages([
//         ...newMessages,
//         { from: "ai", text: "❌ Network error. Please try again." },
//       ]);
//     }
//
//     setLoading(false);
//   };
//
//   return (
//     <div
//       className={`chat-window ${
//         document.body.classList.contains("dark-mode") ? "dark-chat" : ""
//       }`}
//     >
//       <h4>🧠 Ask the AI about this survey</h4>
//
//       <div className="chat-messages">
//         {messages.map((msg, i) => (
//           <div key={i} className={`msg ${msg.from}`}>
//             {msg.text}
//           </div>
//         ))}
//         {loading && <div className="msg ai">Thinking...</div>}
//       </div>
//
//       <input
//         placeholder="Ask something like 'Which group liked the new course?'"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//       />
//     </div>
//   );
// }
//
// export default ChatWindow;
