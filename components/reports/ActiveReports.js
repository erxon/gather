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
import ReportDetails from "./ReportDetails";
import Link from "next/link";

function Report(props) {
  const { id, name, photo, lastSeen, age, gender } = props;

  const image = new CloudinaryImage(photo, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().height(100).width(100));

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
        p: 1,
      }}
      variant="outlined"
    >
      {photo ? (
        <AdvancedImage cldImg={image} />
      ) : (
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100 }}
          image="/assets/placeholder.png"
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", pl: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography gutterBottom variant="h5" component="div">
            <Link style={{textDecoration: 'none', color: '#000000'}} href={`/reports/${id}`}>{name}</Link>
          </Typography>
          <ReportDetails lastSeen={lastSeen} age={age} gender={gender} />
        </CardContent>
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
