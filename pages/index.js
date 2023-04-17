import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Router from "next/router";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

export default function HomePage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      lastSeen: e.currentTarget.lastSeen.value,
      age: e.currentTarget.age.value,
      gender: e.currentTarget.gender.value,
      status: "validating",
    };

    Router.push({
      pathname: "/reporter",
      query: body,
    });
  };
  const handleChange = (changeEvent) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());
    
    console.log(data)
    const publicId = data.public_id.substring(11, 31);
    if(data){
      Router.push(`/reports/upload/${publicId}`)
    }
  };
  return (
    <>
      <div className="w-50 mt-5">
        <div className="mb-3">
          <h1>Report</h1>
          <p>Report a case to nearby authorities.</p>
        </div>
        <form
          method="post"
          onChange={handleChange}
          onSubmit={handleImageSubmit}
        >
          <p>
            <input type="file" name="file" />
          </p>
          <img src={imageSrc} />
          {imageSrc && !uploadData && (
            <p>
              <button>upload files</button>
            </p>
          )}
          {uploadData && (
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
            </code>
          )}
        </form>
        <div className="mb-3">
          <h1>Report</h1>
          <p>Report a case to authorities.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Form.Control id="firstName" name="firstName" type="text" />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <Form.Control id="lastName" name="lastName" type="text" />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="lastSeen">Last seen</Form.Label>
            <Form.Control id="lastSeen" name="lastSeen" type="text" />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="age">Age</Form.Label>
            <Form.Control id="age" name="age" type="text" />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="age">Gender</Form.Label>
            <Form.Control id="gender" name="gender" type="text" />
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit">
            Report
          </Button>
        </form>
      </div>
    </>
  );
}
