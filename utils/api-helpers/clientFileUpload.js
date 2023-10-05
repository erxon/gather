export default async function clientFileUpload(url, formData) {
  const uploadFile = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return uploadFile;
}
