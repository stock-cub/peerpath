"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendStudyGroupMessage } from "@/app/(app)/study-groups/actions";
import type { StudyGroupMessage } from "@/lib/study-group";

export default function StudyGroupThread({
  groupId,
  messages,
  currentUserId,
  names,
}: {
  groupId: string;
  messages: StudyGroupMessage[];
  currentUserId: string;
  names: Record<string, string>;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await sendStudyGroupMessage(groupId, body);

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
            No messages yet — say hi to the group.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  mine ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-slate-800 text-slate-100"
                }`}
              >
                {!mine && (
                  <p className="mb-0.5 text-xs font-medium text-slate-400">
                    {names[message.sender_id] ?? "Someone"}
                  </p>
                )}
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
