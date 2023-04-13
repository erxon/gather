import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Router from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Report(props) {
  const route = `/reports/${props.id}`;
  return (
    <>
      <div>
        <Card style={{ width: "18rem" }}>
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
    </>
  );
}

function GetReports(props) {
  const { data, error } = useSWR(
    `/api/reports/user/${props.username}`,
    fetcher
  );

  if (error) return <div>failed to load </div>;
  if (!data) return <div>loading</div>;

  return (
    <>
      {data.data.map((report) => {
        return (
          <Report
            key={report._id}
            id={report._id}
            photo=""
            firstName={report.firstName}
            lastName={report.lastName}
            lastSeen={report.lastSeen}
            age={report.age}
            gender={report.gender}
          />
        );
      })}
    </>
  );
}
export default function ReportDashboard() {
  //create a card component for each report
  //add view button
  //route the view button to the report
  const [user, { mutate }] = useUser();

  useEffect(() => {
    if(!user){
      return
    }
  }, [user])
  if (!user) return <div>Loading user...</div>
  return (
    <>
      <div className="my-5">
        <p>Welcome {user.username}</p>
        <h2>Your Reports</h2>
        <GetReports username={user.username} />
      </div>
    </>
  );
}
