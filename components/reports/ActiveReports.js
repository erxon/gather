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
import { AdvancedImage, responsive } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFit, fill } from "@cloudinary/url-gen/actions/resize";

function Report(props) {
  const { id, name, photo, lastSeen, age, gender } = props;

  const image = new CloudinaryImage(photo, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().height(200).width(150));

  return (
    <Card
      sx={{
        display: "flex",
        my: 1
      }}
      variant="outlined"
    >
      {photo ? (
          <AdvancedImage cldImg={image} />
      ) : (
        <CardMedia
          component="img"
          sx={{ width: 150 }}
          image="/assets/placeholder.png"
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", py: 2, pl: 1 }}>
        <Box>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2">
              {lastSeen}
              {age} years old, {gender}
            </Typography>
          </CardContent>
        </Box>
        <CardActions>
          <Button variant="contained" size="small" href={`/reports/${id}`}>
            View
          </Button>
        </CardActions>
      </Box>
    </Card>
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

  const reportsToShow = data.activeReports.slice(0, 3);
  return (
    <>
      <Box>
        {data.activeReports.length > 0 ? (
          <Box>
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
          </Box>
        ) : (
          <Typography color="GrayText" variant="body1">
            No active reports yet
          </Typography>
        )}
      </Box>
    </>
  );
}
