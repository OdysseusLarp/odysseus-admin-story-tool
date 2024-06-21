import { apiUrl } from "../api";

export async function updateArtifact(artifact) {
  const requestBody = {
    ...artifact,
    gm_notes: artifact.gm_notes?.trim() ?? null,
    } ?? []

  const response = await fetch(apiUrl("/science/artifact"), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}