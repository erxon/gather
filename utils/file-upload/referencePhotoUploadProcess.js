import { uploadReportPhoto, updateReport } from "@/lib/api-lib/api-reports";
import Compressor from "compressorjs";

const uploadToCloudinary = async (form, numberOfFiles) => {
  let uploadedPhotos = [];
  for (let i = 0; i < numberOfFiles; i++) {
    for (const file of form.elements[i].files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "report-photos");
      const data = await uploadReportPhoto(formData);
      uploadedPhotos.push({
        publicId: data.public_id.substring(14, 34),
        fileName: file.name,
      });
    }
  }

  return uploadedPhotos;
};

const uploadToDatabase = async (uploadedPhotos, reportId, mpName) => {
  const reqBody = {
    images: [...uploadedPhotos],
    type: "reference",
    reportId: reportId,
    missingPerson: mpName,
  };

  const response = await fetch("/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  });

  const uploadedPhoto = await response.json();

  return uploadedPhoto;
};

const getFaceIDs = async (newPhotos) => {
  console.log(newPhotos)
  const response = await fetch(`/api/imagga-face-recognition/${newPhotos._id}`);
  const faceIDs = await response.json();
  console.log(faceIDs)

  return faceIDs;
};

const indexGeneratedFaceIds = async (faceIDs) => {
  await fetch("/api/imagga-face-recognition/save", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      person: { [faceIDs.result.reportId]: faceIDs.result.faceIDs },
    }),
  });
};

export default async function referencePhotoUploadProcess(form, reportId, mpName, numberOfFiles ) {
  const uploadedPhotos = await uploadToCloudinary(form, numberOfFiles);
  //Save photo to Photo database
  const newPhotos = await uploadToDatabase(uploadedPhotos,reportId, mpName);
  //create face ids
  const faceIDs = await getFaceIDs(newPhotos.data);
  console.log(faceIDs)
  //Index face ids
  await indexGeneratedFaceIds(faceIDs);
  const updateReportResponseData = await updateReport(reportId, {
    referencePhotos: newPhotos.data._id,
  });

  return updateReportResponseData;
}
