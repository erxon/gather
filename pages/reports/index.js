import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useUser } from "@/lib/hooks";
import { useState } from "react";

function Report(props) {
  const route = `/reports/${props.id}`;
  let image;
  if (props.photo) {
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
                <strong>Gender: </strong> {props.gender} <br />
                <strong>Status: </strong> {props.status}
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

export default function ReportPage({ data }) {
  const [user, { mutate }] = useUser();
  const [displayData, setDisplayData] = useState(
    data.filter((report) => report.status === 'active')
  );
  const handleChange = (event) => {
    if (event.target.value === "all") {
      setDisplayData(data);
    } else {
      setDisplayData(
        data.filter((report) => report.status === event.target.value)
      );
      console.log(displayData);
    }
  };
  return (
    <div>
      <p>Reports</p>
      <div className="row">
        {user && user.type === "authority" && (
          <div>
            <input
              name="filter"
              type="radio"
              id="pending"
              value="pending"
              onChange={handleChange}
            />
            <label for="pending">Pending Reports</label>
            <br />
            <input
              name="filter"
              type="radio"
              id="active"
              value="active"
              onChange={handleChange}
            />
            <label for="active">Active Reports</label>
            <br />
            <input
              name="filter"
              type="radio"
              id="closed"
              value="closed"
              onChange={handleChange}
            />
            <label for="closed">Closed</label>
            <br />
            <input
              name="filter"
              type="radio"
              id="all"
              value="all"
              onChange={handleChange}
            />
            <label for="all">All</label>
            <br />
            
          </div>
        )}
        {displayData.length > 0 ? (displayData.map((report) => {
          return (
            <Report
              key={report._id}
              id={report._id}
              photo={report.photo}
              firstName={report.firstName}
              lastName={report.lastName}
              lastSeen={report.lastSeen}
              age={report.age}
              gender={report.gender}
              status={report.status}
            />
      )})) : (
            <p>Nothing to show</p>
          )
        }
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/reports");
  const data = await res.json();

  return { props: { data } };
};
