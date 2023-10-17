import { uploadReportPhoto } from "@/lib/api-lib/api-reports";

export default async function uploadReportToCloudinary(file, uploadPreset) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  //Upload photo
  const photoUpload = await uploadReportPhoto(formData);

  return photoUpload;
}
