import { useRouter } from "next/router";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import { fetcher } from "@/lib/hooks";
import SmallMap from "@/components/map/SmallMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StackRowLayout from "@/utils/StackRowLayout";
import Link from "next/link";
import InfoIcon from "@mui/icons-material/Info";
import SearchFoundPerson from "@/components/reports/SearchFoundPerson";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import ContentLayout from "@/utils/layout/ContentLayout";

export default function Upload({ reporters }) {
  const router = useRouter();
  const { photoId } = router.query;
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data)
    return (
      <ContentLayout>
        <Form reporters={reporters} publicId={data.image} photoId={photoId} />
      </ContentLayout>
    );
}

export async function getServerSideProps() {
  const url = process.env.API_URL || "http://localhost:3000";
  const response = await fetch(`${url}/api/reporters`);
  const data = await response.json();

  return {
    props: { reporters: data.data },
  };
}

function PossibleMatch({ name, status, reportedAt, score, photo }) {
  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", alignItems: "flex-start", height: 100 }}
    >
      <CardMedia>
        <ReportPhotoSmall publicId={photo} />
      </CardMedia>
      <CardContent>
        <Typography> Match score: {Math.round(score)}%</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {" "}
          {name}
        </Typography>
        <StackRowLayout spacing={1}>
          <Typography variant="body2">Reported {reportedAt}</Typography>
          <Chip size="small" label={status} />
        </StackRowLayout>
      </CardContent>
    </Card>
  );
}

function generateFoundPersonReportCode(numberOfReports) {
  //numberOfReports is a string
  const numberOfReportsToString = numberOfReports.toString();
  const numberOfZeros = 3 - numberOfReportsToString.length;
  const zeros = "000";
  const reportCode = zeros.substring(0, numberOfZeros).concat(numberOfReports);

  return reportCode;
}

function Form({ reporters, publicId, photoId }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [possibleMatch, setPossibleMatch] = useState({
    _id: null,
    photo: null,
    name: "",
    status: "",
    reportedAt: "",
    score: null,
  });

  const [submitted, isSubmitted] = useState(false);
  const generatedCode =
    "found-" + generateFoundPersonReportCode(reporters.length);
  const url = process.env.API_URL;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setCurrentPosition(position.coords);
      },
      () => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const myImage = new CloudinaryImage(`query-photos/${publicId}`, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(250).height(250));

  //uploaded photo
  //reporter information
  //report information
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      photoUploaded: photoId,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      contactNumber: e.target.contactNumber.value,
      longitude: currentPosition.longitude,
      latitude: currentPosition.latitude,
      email: e.target.email.value,
      possibleMatch: possibleMatch._id,
      code: generatedCode,
    };

    await fetch("/api/reports/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    isSubmitted(true);
  };

  return (
    <div>
      {submitted ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Paper sx={{ p: 3, maxWidth: 600 }}>
            <Stack
              sx={{ mb: 2 }}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <InfoIcon color="primary" />
              <Typography variant="h5">Thank you</Typography>
            </Stack>
            <Typography sx={{ mb: 2 }}>
              Thank you for informing us about this missing person. Authorities
              will contact you at any given moment to verify this report.
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body2">
              Found Person Code:{" "}
              <span style={{ fontWeight: "bold" }}>{generatedCode}</span>
            </Typography>
            <StackRowLayout spacing={0.5}>
              <Typography variant="body2">
                Save this link for updates:{" "}
              </Typography>

              <Link href={`${url}/found-person/${photoId}`}>
                <Typography variant="body2">
                  {url}/found-person/{photoId}
                </Typography>
              </Link>
            </StackRowLayout>
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: 3, maxWidth: 500 }}>
            <Box
              sx={{
                bgcolor: "#f0f0f0",
                borderRadius: "10px",
                textAlign: "center",
                maxWidth: 500,
                height: "auto",
                mb: 2,
              }}
            >
              <AdvancedImage cldImg={myImage} width="200" height="auto" />
            </Box>
            {possibleMatch._id && (
              <PossibleMatch
                name={possibleMatch.name}
                photo={possibleMatch.photo}
                status={possibleMatch.status}
                reportedAt={possibleMatch.reportedAt}
                score={possibleMatch.score}
              />
            )}
            <Box sx={{ my: 3 }}>
              <SearchFoundPerson setPossibleMatch={setPossibleMatch} />
            </Box>
            <Box>
              <StackRowLayout spacing={0.5}>
                <LocationOnIcon />
                <Typography sx={{ fontWeight: "bold" }}>
                  You&apos;re here
                </Typography>
              </StackRowLayout>
              {currentPosition && (
                <SmallMap
                  lng={currentPosition.longitude}
                  lat={currentPosition.latitude}
                />
              )}
            </Box>
            <form onSubmit={handleSubmit}>
              <Typography sx={{ mb: 3 }}>
                Please provide some of your information
              </Typography>
              <Stack
                sx={{ mb: 2 }}
                spacing={1}
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First name"
                  type="text"
                  name="firstName"
                  required
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last name"
                  type="text"
                  name="lastName"
                  required
                />
              </Stack>
              <Stack
                sx={{ mb: 2 }}
                spacing={1}
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Contact number"
                  type="text"
                  name="contactNumber"
                  required
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  type="text"
                  name="email"
                />
              </Stack>
              <Button
                size="small"
                disableElevation
                variant="contained"
                type="submit"
                sx={{ my: 2 }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Box>
      )}
    </div>
  );
}
