"use client";

// The message list + send box for a matched request. Sends via server
// action and relies on the page refresh (router.refresh) to show the
// new message — no realtime needed for v1.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/(app)/requests/[id]/messages/actions";
import type { Message } from "@/lib/message";

export default function MessageThread({
  requestId,
  messages,
  currentUserId,
}: {
  requestId: string;
  messages: Message[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await sendMessage(requestId, body);

    if ("error" in result) {
      setStatus("error");
      return;
    }

    setBody("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">
            No messages yet — say hi to get the conversation started.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  mine
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-slate-800 text-slate-100"
                }`}
              >
                {message.body}
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          Send
        </button>
      </form>
      {status === "error" && (
        <p className="text-sm text-red-400">Couldn&apos;t send. Try again.</p>
      )}
    </div>
  );
}
