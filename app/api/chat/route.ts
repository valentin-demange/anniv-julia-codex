import { NextRequest, NextResponse } from "next/server";
import { BIRTHDAY_SYSTEM_PROMPT } from "@/lib/prompt";
import { getOpenAIClient } from "@/lib/openai";
import { sendConversationToAppsScript, type ConversationMessage } from "@/lib/googleDocs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incoming: unknown = body?.messages;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json(
        { error: "messages field must be a non-empty array" },
        { status: 400 },
      );
    }

    const messages = incoming
      .map((msg: any): ChatMessage => ({
        role: msg?.role === "assistant" ? "assistant" : "user",
        content: typeof msg?.content === "string" ? msg.content : "",
      }))
      .filter((msg) => msg.content.trim().length > 0);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "messages must contain at least one message with content" },
        { status: 400 },
      );
    }

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: typeof body?.model === "string" ? body.model : "gpt-4o-mini",
      temperature: 0.85,
      messages: [
        { role: "system", content: BIRTHDAY_SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const assistantMessage = completion.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "Unable to generate a response for Julia" },
        { status: 502 },
      );
    }

    const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (webhookUrl) {
      const transcript: ConversationMessage[] = [
        ...messages.map((msg): ConversationMessage => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "assistant", content: assistantMessage },
      ];

      sendConversationToAppsScript(webhookUrl, transcript).catch((docError) => {
        console.error("Failed to send conversation to Apps Script", docError);
      });
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayons plus tard." },
      { status: 500 },
    );
  }
}
