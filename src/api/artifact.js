import { apiUrl } from "../api";

export async function updateArtifactGmNotes(artifactId, gmNote) {
  const requestBody = {
    id: artifactId,
    gm_notes: gmNote?.trim() ?? null,
  };

  const response = await fetch(apiUrl("/science/artifact"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  return response;
}
