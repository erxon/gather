//getserversideprops - get all reports that have active status
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import {
  Box,
  CircularProgress,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Grid,
} from "@mui/material";

import ReportPhoto from "../photo/ReportPhoto";

function Report(props) {
  const { id, name, photo, lastSeen, age, gender } = props;
  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ maxWidth: "350px", maxHeight: "260" }} variant="outlined">
        {photo ? (
          <CardMedia sx={{ height: 200 }}>
            <ReportPhoto publicId={photo} />
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
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2">
            <strong>Last known location: </strong>
            {lastSeen}
            <br />
            <strong>Age: </strong>
            {age}
            <br />
            <strong>Gender: </strong>
            {gender}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={`/reports/${id}`}>
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ActiveReports() {
  const { data, error, isLoading } = useSWR(
    "/api/reports/status/active",
    fetcher
  );
  
  

  if (isLoading) return <CircularProgress />;

  if (error) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle2">
          Sorry, reports cannot be rendered
        </Typography>
      </Box>
    );
  }

  const reportsToShow = data.activeReports.slice(0, 3)
  
  return (
    <>
      <Grid container spacing={1}>
        {reportsToShow.map((report) => {
          return (
            <Report
              key={report._id}
              id={report._id}
              name={`${report.firstName} ${report.lastName}`}
              photo={report.photo}
              lastSeen={report.lastSeen}
              gender={report.gender}
              age={report.age}
            />
          );
        })}
      </Grid>
    </>
  );
}
