import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

function Report(props){
    const route = `/reports/${props.id}`;
    let image;
    if(props.photo) {
      image = new CloudinaryImage(props.photo, {
        cloudName: "dg0cwy8vx",
        apiKey: process.env.CLOUDINARY_KEY,
        apiSecret: process.env.CLOUDINARY_SECRET,
      }).resize(fill().width(200).height(200));
    }
  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-12">
        <div className="my-5">
        <Card style={{ width: "100%" }}>
          {image ? (
            <AdvancedImage cldImg={image} />
          ) : (
            <Card.Img variant="top" src="https://placehold.co/50" />
          )}
          <Card.Body>
            <Card.Title>
              {props.firstName} {props.lastName}
            </Card.Title>
            <Card.Text>
              Report ID: {props.id} <br />
              <strong>Last seen: </strong> {props.lastSeen} <br />
              <strong>Age: </strong> {props.age} <br />
              <strong>Gender: </strong> {props.gender}
            </Card.Text>
            <Button href={route} variant="primary">
              View
            </Button>
          </Card.Body>
        </Card>
        </div>
      </div>
    </>
  );
}

export default function ReportPage({data}){
    
    return <div>
        <p>Reports</p>
        <div className="row">
        {
            data.map((report) => {
                return <Report
                    key={report._id}
                    id={report._id}
                    photo={report.photo}
                    firstName={report.firstName}
                    lastName={report.lastName}
                    lastSeen={report.lastSeen}
                    age={report.age}
                    gender={report.gender}
                />
            })
        }
        </div>
    </div>
}

export const getServerSideProps = async () => {
    const res = await fetch('http://localhost:3000/api/reports')
    const data = await res.json();

    return {props: {data}}

}