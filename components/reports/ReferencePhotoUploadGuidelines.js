import FileUploadGuidelines from "../FileUploadGuidelines";

export default function ReferencePhotoUploadGuidelines() {
  return (
    <div>
      <FileUploadGuidelines
        content="It is recommended that you upload at least 3 photos of the missing
            person as a reference for Face Recognition. Each should have a unique
            appearance from the others. They may vary in angle, distance, or
            setting."
      />
      <FileUploadGuidelines content="This will help us give accurate results in Face Search." />
      <FileUploadGuidelines content="File size should be less than 5 MB" />
    </div>
  );
}
