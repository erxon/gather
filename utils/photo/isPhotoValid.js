export default function isPhotoValid(file) {
  if (
    file.size < 500000 &&
    (file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png")
  ) {
    return {
      valid: true,
      message: "Success"
    };
  } else {
    return {
      valid: false,
      message: "The file size or type isn't supported."
    }
  }
}
