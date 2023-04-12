import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';

export default function Reporter() {
  //form for reporter
  //form for the report editing
  const router = useRouter();

  const {
    firstName, 
    lastName, 
    lastSeen, 
    age, 
    gender } = router.query;
  const [image, setImage] = useState({ file: "" });
  const handleChange = (event) => {
    setImage({
      file: URL.createObjectURL(event.target.files[0]),
    });
  };
  
  return (
    <>
      <div className="py-5">
        <div style={{backgroundColor: "#efefef"}} className="p-3 mb-4">
            <h1>Your Report</h1>
            <hr />
            <strong>Name: </strong>{firstName} {lastName} <br />
            <strong>Last seen: </strong> {lastSeen} <br />
            <strong>Age: </strong> {age} <br />
            <strong>Gender: </strong> {gender}
        </div>
        <p>To complete the report, we need to have your information.</p>
        <div className="mb-3">
          {image.file ? (
            <img
              src={image.file}
              style={{
                borderRadius: '20px',
                border: '1px solid #000',
                width: "100px",
                height: "100px",
              }}
            />
          ) : (
            <img style={{
                borderRadius: '20px',
                border: '1px solid #000'
              }} src="https://placehold.co/100" />
          )}
        </div>
        <input type="file" onChange={handleChange} />
        <div>
          <form>
            <div className="row pt-5">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="pe-5">
                  <h2>Information</h2>
                  <p>Please provide your basic information here</p>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="firstName">First name</Form.Label>
                    <Form.Control name="firstName" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="lastName">Last name</Form.Label>
                    <Form.Control id="lastName" name="lastName" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="relationToMissing">
                      Relation to missing
                    </Form.Label>
                    <Form.Control
                      id="relationToMissing"
                      name="relationToMissing"
                      type="text"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="contactNum">Contact number</Form.Label>
                    <Form.Control
                      id="contactNum"
                      name="contactNumber"
                      type="text"
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="pe-5">
                  <h2>Signup</h2>
                  <p>Please create an account as a concerned citizen</p>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="firstName">First name</Form.Label>
                    <Form.Control name="firstName" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="lastName">Last name</Form.Label>
                    <Form.Control id="lastName" name="lastName" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="lastName">Last name</Form.Label>
                    <Form.Control id="lastName" name="lastName" type="text" />
                  </Form.Group>
                </div>
              </div>
            </div>

            <Button className="mt-3" variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
