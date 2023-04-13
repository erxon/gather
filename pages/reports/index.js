import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Report(props){
    const route = `/reports/${props.id}`;
  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-12">
        <div className="my-5">
        <Card style={{ width: "100%" }}>
          {props.photo === "" ? (
            <Card.Img variant="top" src="https://placehold.co/50" />
          ) : (
            <Card.Img variant="top" src={props.photo} />
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
                    photo=""
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