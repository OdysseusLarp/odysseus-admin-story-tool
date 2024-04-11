import { apiUrl } from "../api";

export async function upsertMessage(message) {
  const requestBody = {
    ...message,
    name: message.name?.trim(),
    message: message.message?.trim(),
    after_jump: message.after_jump ?? null,
    gm_notes: message.gm_notes?.trim() ?? null,
    // Should only contain IDs, not the full object
    receivers: message.receivers.map((receiver) => {
      if (typeof receiver === 'string') {
        return receiver;
      }
      if (typeof receiver === 'object' && receiver.id !== undefined) {
        return receiver.id;
      }
      throw new Error(`Invalid receiver: ${receiver}`);
    }),
  };

  const response = await fetch(apiUrl("/story/messages"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}