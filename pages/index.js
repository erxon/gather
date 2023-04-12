import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Router from "next/router";
import Alert from 'react-bootstrap/Alert';


export default function HomePage() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            firstName: e.currentTarget.firstName.value,
            lastName: e.currentTarget.lastName.value,
            lastSeen: e.currentTarget.lastSeen.value,
            age: e.currentTarget.age.value,
            gender: e.currentTarget.gender.value
        }

        const res = await fetch('/api/reports', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if(res.status === 200){
            Router.push('/reporter');
        } else {
            return <Alert variant="warning">Something went wrong</Alert>
        }
    }
  return (
    <>
      <div className="w-50 mt-5">
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
