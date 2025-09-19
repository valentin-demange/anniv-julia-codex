"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import clsx from "clsx";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

const INITIAL_ASSISTANT_MESSAGE = `Coucou ma queen ! On est en mission spéciale : choisir LE spectacle de stand-up qui fera vibrer ton anniversaire. Pose toutes tes questions, je te déroule le tapis rouge.`;

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "assistant-0",
      role: "assistant",
      content: INITIAL_ASSISTANT_MESSAGE,
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!windowRef.current) return;
    windowRef.current.scrollTop = windowRef.current.scrollHeight;
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    };

    const optimisticMessages = [...messages, userMessage];
    setMessages(optimisticMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: optimisticMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { message?: string; error?: string };

      if (!data.message) {
        throw new Error(data.error ?? "Réponse inattendue de l'IA.");
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (fetchError: any) {
      console.error(fetchError);
      setError("Oups, la magie a trébuché. Réessaie dans un instant !");
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      setInput(userMessage.content);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="chat-shell">
      <div className="hero">
        <h1 className="hero-title">Mission Anniversaire de Julia 🎉</h1>
        <p className="hero-subtitle">
          Laisse-toi guider par notre IA party-planner pour choisir le spectacle de stand-up parfait.
          Les copains n'attendent plus que ton feu vert, ma queen !
        </p>
      </div>

      <div className="chat-window" ref={windowRef}>
        {messages.map((message) => (
          <article key={message.id} className={clsx("message", message.role)}>
            <span>{message.content}</span>
            <span className="message-time">{formatTime(message.createdAt)}</span>
          </article>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          name="message"
          placeholder="Dis-moi tout : tes envies, tes hésitations, tes plans secrets..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          maxLength={800}
          disabled={isLoading}
        />
        <div className="status-line">
          {isLoading ? "Julia parle, l'IA prend des notes..." : "Prête à t'écouter."}
          {error ? <span className="error-line">{error}</span> : null}
        </div>
        <button type="submit" className="chat-submit" disabled={isLoading}>
          {isLoading ? "En cours..." : "Envoyer à la team"}
        </button>
      </form>
    </section>
  );
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}
