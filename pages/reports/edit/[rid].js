import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function EditReport({ data }) {
  const [image, setImage] = useState({ file: "" });
  const [body, setBody] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    lastSeen: data.lastSeen,
    age: data.age,
    gender: data.gender,
    email: data.email,
    contactNumber: data.contactNumber
  })
  const [accounts, setAccounts] = useState([...data.socialMediaAccount]);
  const [features, setFeatures] = useState([...data.features]);
  const [value, setValue] = useState({
    account: "",
    feature: ""
  });


  const handleChange = (event) => {
    setImage({
      file: URL.createObjectURL(event.target.files[0]),
    });
  };
  const handleInputChange = (e) => {
    const {value, name} = e.target;
    setValue((prev) => {
      return {...prev, [name]: value}
    });
  }
  const handleFormChange = (e) => {
    const {value, name} = e.target;
    setBody((prev) => {
      return {...prev, [name]: value}
    })
  }
  const handleInputSubmit = (typeOfInput) => {
    if (typeOfInput === "account") {
      setAccounts((prev) => {return [...prev, value.account]})
    } else if (typeOfInput === "features"){
      setFeatures((prev) => {return [...prev, value.feature]})
    }
    
    setValue({
      account: "",
      feature: ""
    })
  }

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: ""
  });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const update = {
      ...body,
      socialMediaAccount: [...accounts],
      features: [...features]
    }

    const res = await fetch(`/api/reports/${data._id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(update)
    });
    const message = await res.json()
    if (res.status === 200){
      setAlert({
        show: true,
        message: message.message,
        variant: "success"
      })
    } else {
      setAlert({
        show: true,
        message: message.message,
        variant: "warning"
      })
    }
  }

  //timer for alert
  setTimeout(() => {
    setAlert((prev) => {
      return {...prev, show: false}
    })
  }, 20000)

  return (
    <>
      <div>
        <form onSubmit={handleFormSubmit}>
          {alert.show && (
          <Alert variant={alert.variant}>
            {alert.message}
          </Alert>
          )}
          <h3>Photo</h3>
          {image.file ? (
            <img
              src={image.file}
              style={{
                borderRadius: "20px",
                border: "1px solid #000",
                width: "250px",
                height: "250px",
              }}
            />
          ) : (
            <img
              style={{
                borderRadius: "20px",
                border: "1px solid #000",
              }}
              src="https://placehold.co/250"
            />
          )}
          <br />
          <br />
          <input type="file" onChange={handleChange} />
          <Button variant="primary">Upload</Button>
          <div className="row">
            <div
              style={{ marginTop: "auto", marginBottom: "auto" }}
              className="col-3"
            >
              <p style={{ marginTop: "auto", marginBottom: "auto" }}>Name</p>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="firstName">First Name</Form.Label>
                <input onChange={handleFormChange} value={body.firstName} id="firstName" name="firstName" type="text" />
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="lastName">Last Name</Form.Label>
                <input onChange={handleFormChange} value={body.lastName} id="lastName" name="lastName" type="text" />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div
              style={{ marginTop: "auto", marginBottom: "auto" }}
              className="col-3"
            >
              <p style={{ marginTop: "auto", marginBottom: "auto" }}>
                Information
              </p>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="age">Age</Form.Label>
                <input onChange={handleFormChange} value={body.age} id="age" name="age" type="age" />
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="gender">Gender</Form.Label>
                <input onChange={handleFormChange} value={body.gender} id="gender" name="gender" type="text" />
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="lastSeen">Last seen</Form.Label>
                <input onChange={handleFormChange} value={body.lastSeen} id="lastSeen" name="lastSeen" type="text" />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div
              style={{ marginTop: "auto", marginBottom: "auto" }}
              className="col-3"
            >
              <p style={{ marginTop: "auto", marginBottom: "auto" }}>
                Contact Information
              </p>
            </div>
          <div className="col-3">
              <Form.Group>
                <Form.Label id="email">Email of the missing</Form.Label>
                <input onChange={handleFormChange} value={body.email} id="email" name="email" type="age" />
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group>
                <Form.Label id="contactNumber">Contact Number of the missing</Form.Label>
                <input onChange={handleFormChange} value={body.contactNumber} id="contactNumber" name="contactNumber" type="text" />
              </Form.Group>
            </div>
            <div className="col-3"></div>
          </div>
          <div>

            <p><strong>Social Media Accounts</strong></p>
            {accounts.map((account) => {
                return <p>{account}</p>
            })}
            <input name="account" value={value.account} onChange={handleInputChange} />
            <Button size="sm" onClick={() => {handleInputSubmit("account")}}><i className="bi bi-plus-lg"></i></Button>
          </div>
          <div>
            <p><strong>Features</strong></p>
            {features.map((feature) => {
                return <p>{feature}</p>
            })}
            <input name="feature" value={value.feature} onChange={handleInputChange} />
            <Button size="sm" onClick={() => {handleInputSubmit("features")}}><i className="bi bi-plus-lg"></i></Button>
          </div>
          <Button onClick={handleFormSubmit}>Save</Button>
        </form>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { rid } = params;
  const res = await fetch(`http://localhost:3000/api/reports/${rid}`);

  const data = await res.json();

  if (!data) {
    return {
      redirect: {
        destination: `/reports/${rid}`,
        permanent: false,
      },
    };
  }
  return {
    props: { data },
  };
}
