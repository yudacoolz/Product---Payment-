// // "use client";

// // import { useChat } from "@ai-sdk/react";
// // import { useState } from "react";

// // export default function ChatPage() {
// //   const [input, setInput] = useState("");
// //   const { messages, sendMessage, status } = useChat();

// //   return (
// //     <div className="mx-auto flex max-w-xl flex-col gap-3 p-4">
// //       {messages.map((m) => (
// //         <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
// //           <b>{m.role === "user" ? "You" : "Bot"}: </b>
// //           {m.parts.map((part, i) =>
// //             part.type === "text" ? <span key={i}>{part.text}</span> : null,
// //           )}
// //         </div>
// //       ))}

// //       <form
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           if (!input.trim()) return;
// //           sendMessage({ text: input });
// //           setInput("");
// //         }}
// //         className="flex gap-2"
// //       >
// //         <input
// //           className="flex-1 rounded border p-2"
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           placeholder="Ask about our products..."
// //         />
// //         <button disabled={status !== "ready"} className="rounded border px-4">
// //           Send
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";

// export default function ChatPage() {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function sendMessage() {
//     if (!message.trim()) return;

//     setLoading(true);
//     setResponse("");

//     try {
//       const res = await fetch("/api/chats", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message }),
//       });

//       const raw = await res.text(); // read the body once

//       let data: any = null;
//       try {
//         data = JSON.parse(raw);
//       } catch {
//         // not JSON
//       }

//       if (!res.ok) {
//         throw new Error(
//           data?.error ?? `Request failed (${res.status}): ${raw.slice(0, 100)}`,
//         );
//       }

//       setResponse(data.message);
//     } catch (error) {
//       console.error(error);
//       setResponse(
//         error instanceof Error ? error.message : "Something went wrong.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Gemini Chatbot</h1>

//       <div className="mt-6 flex gap-2">
//         <input
//           className="border p-2"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Ask something..."
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               sendMessage();
//             }
//           }}
//         />

//         <button
//           className="border px-4 py-2"
//           onClick={sendMessage}
//           disabled={loading}
//         >
//           {loading ? "Thinking..." : "Send"}
//         </button>
//       </div>

//       {response && (
//         <div className="mt-6">
//           <strong>Gemini:</strong>

//           <p className="mt-2 whitespace-pre-wrap">{response}</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();
      console.log("data chatbot : ", data);

      setResponse(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Chatbot</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={sendMessage}>Send</button>

      {loading && <p>Thinking...</p>}

      {response && (
        <div>
          <strong>AI:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
