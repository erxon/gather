//reports
export async function sendNotification(data) {
  console.log(data);
  const res = await fetch("/api/notification/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}

export async function getNotifications() {
  const res = await fetch("/api/notification/reports");
  const json = await res.json();
  return json;
}

export async function removeNotification(id) {
  const res = await fetch("/api/notification/reports", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  });
  const json = await res.json();
  return json;
}

//The following are set of Fetchers for notifications involving contacts

export async function addToContactRequest(data) {
  const res = await fetch("/api/notification/contact-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}

export async function getContactRequests() {
  const res = await fetch("/api/notification/contacts");
  const json = await res.json();
  return json;
}

export async function removeContactNotification(id) {
  const res = await fetch("/api/notification/contacts", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id: id}),
  });
  const json = await res.json();
  return json;
}

export async function requestAccepted(data){
  const res = await fetch('/api/notification/contactReqAccepted', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  const json = await res.json();
  return json;
}
export async function acceptedRequestNotifications(){
  const res = await fetch('/api/notification/contactReqAccepted')
  const json = await res.json();
  return json;
}