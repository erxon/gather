import { uploadReportPhoto, updateReport } from "@/lib/api-lib/api-reports";

const uploadPhotosToCloudinary = async (referencePhotos) => {
  const uploadedReferencePhotos = [];

  try {
    for (let i = 0; i < referencePhotos.length; i++) {
      const formData = new FormData();
      formData.append("file", referencePhotos[i].file);
      formData.append("upload_preset", "report-photos");
      const data = await uploadReportPhoto(formData);
      uploadedReferencePhotos.push({
        publicId: data.public_id.substring(14, 34),
        createdAt: new Date(),
        fileName: referencePhotos[i].file.name,
      });
    }

    return uploadedReferencePhotos;
  } catch (error) {
    return error;
  }
};

const uploadToDatabase = async (
  uploadedReferencePhotos,
  reportId,
  missingPersonName
) => {
  try {
    const body = {
      images: [...uploadedReferencePhotos],
      type: "reference",
      reportId: reportId,
      missingPerson: missingPersonName,
    };

    const uploadResult = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const newPhotos = await uploadResult.json();

    return newPhotos;
  } catch (error) {
    return error;
  }
};

const getFaceIDs = async (newPhotos) => {
  try {
    const response = await fetch(
      `/api/imagga-face-recognition/${newPhotos.data._id}`
    );

    const faceIDs = await response.json();

    return faceIDs;
  } catch (error) {
    return error;
  }
};

const saveFaceIDs = async (faceIDs) => {
  try {
    const response = await fetch("/api/imagga-face-recognition/save", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person: { [faceIDs.result.reportId]: faceIDs.result.faceIDs },
      }),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return error;
  }
};

export default async function referencePhotoUploadProcess(
  referencePhotos,
  reportId,
  missingPersonName
) {
  try {
    const uploadedReferencePhotos = await uploadPhotosToCloudinary(
      referencePhotos
    );
    const newPhotos = await uploadToDatabase(
      uploadedReferencePhotos,
      reportId,
      missingPersonName
    );

    const faceIDs = await getFaceIDs(newPhotos);
    await saveFaceIDs(faceIDs);

    const result = await updateReport(reportId, {
      referencePhotos: newPhotos.data._id,
    });

    return result;
  } catch (error) {
    return error;
  }
}
