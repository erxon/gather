export async function getUser(id) {
  const res = await fetch(`http://localhost:3000/api/user/${id}`);
  const data = await res.json();

  return data;
}

