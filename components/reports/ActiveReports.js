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
import Image from "next/image";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";

function Report(props) {
  const { id, name, photo, lastSeen, age, gender, date } = props;

  const image = new CloudinaryImage(photo, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().width(150).height(150));

  const reportedDate = new Date(date);
  const dateString = reportedDate.toDateString();
  const timeString = ampmTimeFormat(reportedDate);

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
      }}
      variant="outlined"
    >
      <CardMedia sx={{height: 150}}>
        {photo ? (
          <AdvancedImage cldImg={image} />
        ) : (
          <Image alt="placeholder" width={150} height={150} src="/assets/placeholder.png" />
        )}
      </CardMedia>
      <Box sx={{ display: "flex", flexDirection: "column", pl: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography sx={{fontWeight: "bold"}} variant="body1">
            <Link
              style={{ textDecoration: "none", color: "#000000" }}
              href={`/reports/${id}`}
            >
              {name}
            </Link>
          </Typography>
          <Typography sx={{ mb: 1 }} variant="subtitle2">
            {dateString} {timeString}
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
  const remaining = data.activeReports.length - reportsToShow.length;

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
                  date={report.reportedAt}
                />
              );
            })}
            {remaining > 0 && (
              <Typography color="primary">+{remaining} more reports</Typography>
            )}
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
