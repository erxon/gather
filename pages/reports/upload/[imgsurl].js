import { useRouter } from "next/router";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { useState } from "react";
import { Button, Typography } from "@mui/material";

export default function Upload() {
  const router = useRouter();
  const { imgsurl } = router.query;
  const [submitted, isSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  
  
  
  const publicId = `my-uploads/${imgsurl}`;
  const myImage = new CloudinaryImage(publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(100).height(150));

  //uploaded photo
  //reporter information
  //report information
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      photo: publicId,
      rFirstName: e.target.rFirstName.value,
      rLastName: e.target.rLastName.value,
      rRelationToMissing: e.target.rRelationToMissing.value,
      rContactNumber: e.target.rContactNumber.value,
      rEmail: e.target.rEmail.value,
      mpFirstName: e.target.mpFirstName.value,
      mpLastName: e.target.mpLastName.value,
      mpAge: e.target.mpAge.value,
      mpGender: e.target.mpGender.value,
      mpLastSeen: e.target.mpLastSeen.value,
    };
    const res = await fetch("/api/reports/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setReportId(data.data._id)
    isSubmitted(true);
  };
  return (
    <>
      {submitted ? (
        <div>
          <p>We will update you if there is a progress in your report.</p>
          <button>Home</button>
          <Typography>If you want to manage this report with the authorities, signup for an account.</Typography>
          <Button href={`/reports/create-account/${reportId}`}>Manage Report</Button>
        </div>
      ) : (
        <div>
          <div>
            <div>
              <AdvancedImage cldImg={myImage} />
              <p>Not found in database</p>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <p>Please provide some information</p>
              <h2>Your Information</h2>
              <input placeholder="first name" type="text" name="rFirstName" />
              <br />
              <input placeholder="last name" type="text" name="rLastName" />
              <br />
              <input
                placeholder="relation to missing"
                type="text"
                name="rRelationToMissing"
              />
              <br />
              <input
                placeholder="contact number"
                type="text"
                name="rContactNumber"
              />
              <br />
              <input placeholder="email" type="text" name="rEmail" />
              <br />
              <h2>Report</h2>
              <input placeholder="first name" type="text" name="mpFirstName" />
              <br />
              <input placeholder="last name" type="text" name="mpLastName" />
              <br />
              <input placeholder="age" type="text" name="mpAge" />
              <br />
              <input placeholder="gender" type="text" name="mpGender" />
              <br />
              <input placeholder="last seen" type="text" name="mpLastSeen" />
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
