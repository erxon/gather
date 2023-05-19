import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import useSWR from "swr";
import Router from "next/router";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  CardMedia,
  Box,
  CircularProgress,
} from "@mui/material";
import ReportPhoto from "@/components/photo/ReportPhoto";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Report(props) {
  return (
    <>
      <Box>
        <Card sx={{ maxWidth: "350px", maxHeight: "260" }}>
          {props.photo ? (
            <CardMedia sx={{ height: 200 }}>
              <ReportPhoto publicId={props.photo} />
            </CardMedia>
          ) : (
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                height: "200px",
              }}
            ></Box>
          )}
          <CardContent>
            <Typography>
              {props.firstName} {props.lastName}
            </Typography>
            <Typography>
              <strong>Last seen: </strong> {props.lastSeen} <br />
              <strong>Age: </strong> {props.age} <br />
              <strong>Gender: </strong> {props.gender}
            </Typography>
          </CardContent>
          <CardActions>
            <Button fullWidth variant="contained" href={`/reports/${props.id}`}>View</Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

function GetReport(props) {
  const { data, error, isLoading } = useSWR(
    `/api/reports/user/${props.username}`,
    fetcher
  );

  if (error) return <div>failed to load </div>;
  if (isLoading) return <CircularProgress />;

  return (
    <>
      {data.data.map((report) => {
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
    if (!user) {
      return;
    }
  }, [user]);

  if (!user) return <div>Loading user...</div>;
  return (
    <>
      <Box>
        <Typography variant="h6">Your Reports</Typography>
        <Box sx={{ my: 3 }}>
          <GetReport username={user.username} />
        </Box>
      </Box>
    </>
  );
}
