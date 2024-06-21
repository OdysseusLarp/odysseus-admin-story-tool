import { apiUrl } from "../api";

export async function updateCharacter(character) {
  const requestBody = {
    ...character,
    gm_notes: character.gm_notes?.trim() ?? null,
    } ?? []

  const response = await fetch(apiUrl("/person/" + character.id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}