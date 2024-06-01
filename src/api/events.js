import { apiUrl } from "../api";

export async function upsertEvent(event) {
  const requestBody = {
    ...event,
    name: event.name?.trim(),
    description: event.message?.trim() ?? null,
    after_jump: event.after_jump ?? null,
    gm_notes: event.gm_notes?.trim() ?? null,
    gm_note_npc: event.gm_notes?.trim() ?? null,
    } ?? []

  const response = await fetch(apiUrl("/story/events"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}