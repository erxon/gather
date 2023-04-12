import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Reporter() {
    //form for reporter
    //form for the report editing
    const [image, setImage] = useState({file: ''});
    const handleChange = (event) => {
        setImage({
            file: URL.createObjectURL(event.target.files[0])
        });
    }
    return <>
        <div className="py-5">
            <h1>Reporter</h1>
            <p>To complete the report, we need to have your information.</p>
            <div className="mb-3">
                {image.file ? (<img src={image.file} style={{
                    width: '250px',
                    height: '250px'
                }} />) : <img src="https://placehold.co/250x250" />}
            </div>
            <input type="file" onChange={handleChange}/>
            <div className="w-50">
                <form>
                <Form.Group className="mt-3">
                    <Form.Label htmlFor="firstName">First name</Form.Label>
                    <Form.Control name="firstName" type="text" />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="lastName">Last name</Form.Label>
                    <Form.Control id="lastName" name="lastName" type="text" />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="relationToMissing">Relation to missing</Form.Label>
                    <Form.Control id="relationToMissing" name="relationToMissing" type="text" />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="contactNum">Contact number</Form.Label>
                    <Form.Control id="contactNum" name="contactNumber" type="text" />
                </Form.Group>
                <Button className="mt-3" variant="primary" type="submit">Submit</Button>
            </form>
            </div>
        </div>
    </>
}

