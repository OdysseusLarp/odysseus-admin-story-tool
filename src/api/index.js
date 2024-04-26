export function apiUrl(path) {
  return process.env.REACT_APP_ODYSSEUS_API_URL + path;
}

export async function apiGetRequest(url) {
  const response = await fetch(apiUrl(url));
  const data = await response.json();
  return data;
}