import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Router from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@/lib/hooks";

export default function Reporter() {
  //form for reporter
  //form for the report editing
  const [user, {mutate}] = useUser();
  const router = useRouter();
  const {
    firstName,
    lastName,
    lastSeen,
    age,
    gender,
    status
  } = router.query;
  const [image, setImage] = useState({ file: "" });
  const handleChange = (event) => {
    setImage({
      file: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const report = {
        username: e.target.username.value,
        firstName: firstName,
        lastName: lastName,
        lastSeen: lastSeen,
        age: age,
        gender: gender,
    }
    const signup = {
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(report)
    console.log(signup)
    const resSignup = await fetch('/api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(signup)
    })
    if (resSignup.status === 201) {
      const userObj = await resSignup.json();
      // set user to useSWR state
      const resReport = await fetch('/api/reports', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(report)
      });
      
      if (resReport.status === 200) {
        Router.push('/reportDashboard');
      }
      mutate(userObj);
    }

    // if (resSignup.status === 201){
    //     Promise.all(
    //         [
    //             fetch('/api/reporters', {
    //                 method: 'POST', 
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify(reporter)
    //             }),
    //             fetch('/api/reports', {
    //                 method: 'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify(report)
    //             })
    //         ]
    //     ).then(([reporterData, reportData]) => {
    //         if (reporterData.status === 200 && reportData.status === 200) {
    //             Router.push("/reportDashboard");
    //         }
    //     })
    // }
  }
  
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
          <form onSubmit={handleSubmit}>
            <div>
              {/* <div className="col-lg-6 col-md-12 col-sm-12">
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
              </div> */}

              <div>
                <div className="w-50">
                  <h2>Signup</h2>
                  <p>Please create an account as a concerned citizen</p>
                  <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control id="username" name="username" type="text" />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control name="email" type="email" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control id="password" name="password" type="password" />
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
