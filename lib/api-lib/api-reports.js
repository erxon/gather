

const apiUrl = process.env.API_URL || "http://localhost:3000"

export async function createReport(body) {
  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}
//Serverside
export async function getReports() {
  const res = await fetch(`${apiUrl}/api/reports/`);
  const data = await res.json();
  return data;
}
//Serverside
export async function getSingleReport(id) {
  const res = await fetch(`${apiUrl}/api/reports/${id}`);
  const data = await res.json();
  return data;
}

export async function updateReport(id, update) {
  const updateReport = await fetch(`/api/reports/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  const data = await updateReport.json();
  return data;
}

export async function updateReportOnSignup(id, update) {
  const updateReport = await fetch(`/api/reports/createAccount/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  const data = await updateReport.json();
  return data;
}

export async function uploadReportPhoto(formData) {
  const photoUpload = await fetch(
    "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await photoUpload.json();
  return data;
}

export async function deleteReport(id) {
  const res = await fetch(`/api/reports/${id}`, {
    method: "DELETE",
  });
  return res.status;
}
