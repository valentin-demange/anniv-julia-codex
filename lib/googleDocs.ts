type ConversationMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type AppsScriptPayload = {
  timestamp: string;
  messages: ConversationMessage[];
};

export async function sendConversationToAppsScript(
  webhookUrl: string,
  messages: ConversationMessage[],
): Promise<void> {
  if (!webhookUrl) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL is not configured.");
  }

  const payload: AppsScriptPayload = {
    timestamp: new Date().toISOString(),
    messages,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apps Script logging failed: ${response.status} ${errorText}`);
  }
}

export type { ConversationMessage };
