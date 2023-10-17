import isPhotoValid from "@/utils/photo/isPhotoValid";

function readFile(file, callback) {
  const reader = new FileReader();

  reader.onload = function (onLoadEvent) {
    callback(onLoadEvent, file);
  };

  reader.readAsDataURL(file);
}

export default function fileProcessing(file, successCallback, errorCallback) {
  if (!file) return;
  const validatePhoto = isPhotoValid(file);

  if (validatePhoto.valid) {
    readFile(file, (onLoadEvent, file) => {
      successCallback(onLoadEvent, file);
    });
  } else {
    errorCallback(validatePhoto.message);
  }
}
