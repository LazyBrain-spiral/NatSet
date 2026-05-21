import React, { useState, useRef, useEffect } from "react";

export default function OllamaChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTasks, setPendingTasks] = useState(null); 
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${data.error}` },
        ]);
      } else if (data.success) {
        setPendingTasks(data.data); 
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Here are your 5 tasks. Save them to JSON?",
            tasks: data.data.tasks,
            title: data.data.title,
            awaitingConfirm: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Backend not reachable. Start server on port 3001.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingTasks) return;

    try {
      const res = await fetch("http://localhost:3001/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: pendingTasks }),
      });

      const result = await res.json();

      setMessages((prev) =>
        prev
          .map((msg) =>
            msg.awaitingConfirm ? { ...msg, awaitingConfirm: false } : msg,
          )
          .concat({
            role: "assistant",
            content: result.success
              ? `✅ Tasks Uploaded!`
              : `❌ tasks couldn't be saved. Try again.`,
          }),
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Could not reach save endpoint." },
      ]);
    } finally {
      setPendingTasks(null);
    }
  };

  const handleDiscard = () => {
    setMessages((prev) =>
      prev
        .map((msg) =>
          msg.awaitingConfirm ? { ...msg, awaitingConfirm: false } : msg,
        )
        .concat({
          role: "assistant",
          content: "Discarded. What would you like to do instead?",
        }),
    );
    setPendingTasks(null);
  };

  return (
    <div className="flex flex-col h-screen mx-auto bg-[#0B0B1A]">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <div className="font-semibold">Task i guess</div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-orange-900 text-orange-300"
                      : "bg-green-900 text-green-300"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-900 text-gray-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>

              {msg.tasks && (
                <div className="ml-11 mt-3 space-y-2">
                  {msg.title && (
                    <div className="text-white font-bold text-base mb-3 px-1">
                      📋 {msg.title}
                    </div>
                  )}
                  {msg.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 font-bold text-sm">
                          {task.id}.
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">
                            {task.title}
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            {task.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Buttons only show while awaiting confirm */}
                  {msg.awaitingConfirm && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg font-medium"
                      >
                        Save to JSON
                      </button>
                      <button
                        onClick={handleDiscard}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg font-medium"
                      >
                        Discard
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-green-900 text-green-300">
              AI
            </div>
            <div className="px-4 py-3 rounded-lg bg-gray-900">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-200" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-800">
        <input
          type="text"
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-700"
          placeholder="What do you want to accomplish?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading || !!pendingTasks}
        />
        <button
          className="w-12 h-12 bg-green-500 text-black rounded-lg font-bold hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={sendMessage}
          disabled={!input.trim() || loading || !!pendingTasks}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
