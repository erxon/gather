//reports
export async function sendNotification(data){
    console.log(data)
    const res = await fetch('/api/notification/reports', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const json = await res.json();
    return json;
}

export async function getNotifications(){
    const res = await fetch('/api/notification/reports')
    const json = await res.json()
    return json;
}

export async function removeNotification(id){
    const res = await fetch('/api/notification/reports', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
    })
    const json = await res.json()
    return json;
}

export async function addToContactRequest(data){
    const res = await fetch('/api/notification/contacts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    const json = await res.json();
    return json;
}