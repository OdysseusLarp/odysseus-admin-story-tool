import { apiUrl } from "../api";

export async function upsertPlot(plot) {
  const requestBody = {
    ...plot,
    name: plot.name?.trim(),
    description: plot.description?.trim() ?? null,
    after_jump: plot.after_jump ?? null,
    gm_notes: plot.gm_notes?.trim() ?? null,
    copy_from_characters: plot.copy_from_characters?.trim() ?? null,
    } ?? []

  const response = await fetch(apiUrl("/story/plots"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}