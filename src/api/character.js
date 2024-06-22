import { apiUrl } from "../api";

export async function updateCharacterGmNotes(personId, gmNotes) {
  const requestBody = {
    gm_notes: gmNotes?.trim() ?? null,
  };

  const response = await fetch(apiUrl("/person/" + personId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  return response;
}
