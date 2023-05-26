const apiUrl = process.env.API_URL || 'http://localhost:3000'

export async function getUser(id) {
  const res = await fetch(`${apiUrl}/api/user/${id}`);
  const data = await res.json();

  return data;
}

