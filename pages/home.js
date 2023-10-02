import { useRouter } from "next/router";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import PeopleIcon from "@mui/icons-material/People";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

import Image from "next/image";
import ReportWithPhoto from "@/components/home/ReportWithPhoto";
import ReportToManage from "@/components/home/ReportToManage";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import Signup from "@/components/authentication/Signup";

function Report({ reportId, photo, name, lastSeen, gender, age }) {
  const router = useRouter();
  return (
    <Card
      sx={{
        height: 100,
        display: "flex",
      }}
    >
      {photo ? (
        <ReportPhotoSmall publicId={photo} />
      ) : (
        <Image
          alt="placeholder"
          width={100}
          height={100}
          src="/assets/placeholder.png"
        />
      )}
      <CardContent>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="body2">Last seen in {lastSeen}</Typography>
        <Typography variant="body2">
          {gender}, {age}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            router.push(`/reports/${reportId}`);
          }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}

function Reports() {
  const { data, error, isLoading } = useSWR(
    "/api/reports/status/active",
    fetcher
  );

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Active Reports
      </Typography>
      <Grid container>
        {data.activeReports.length > 0 ? (
          data.activeReports.map((report, index) => {
            if (index > 2) return;
            return (
              <Grid item key={report._id} xs={12} md={4} sm={6}>
                <Report
                  reportId={report._id}
                  name={`${report.firstName} ${report.lastName}`}
                  photo={report.photo}
                  lastSeen={report.lastSeen}
                  gender={report.gender}
                  age={report.age}
                />
              </Grid>
            );
          })
        ) : (
          <Typography color="GrayText">No active reports yet.</Typography>
        )}
      </Grid>
    </Box>
  );
}

export default function HomePage() {
  return (
    <div>
      <Box
        sx={{
          p: 2,
          borderRadius: "20px",
        }}
      >
        <Typography variant="h1">Gather</Typography>
        <Box sx={{ my: 1, width: { xs: "75%", md: "50%" } }}>
          <Typography sx={{ mb: 1 }}>
            Gather is a platform where citizens and authorities could
            collaborate to find missing people in the community. It utilizes
            <span style={{ fontWeight: "bold" }}> Face Recognition</span>,
            <span style={{ fontWeight: "bold" }}> Geolocation</span> and
            <span style={{ fontWeight: "bold" }}> Mapping</span> tools to aid
            search efforts.
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="body1"
            color="primary"
          >
            Manage. Disseminate. Communicate. Locate.
          </Typography>
        </Box>

        <Reports />
        {/*ReportWithPhoto*/}
        <Grid sx={{ my: 3 }} container spacing={1}>
          <Grid item xs={12} md={6}>
            <ReportWithPhoto />
          </Grid>
          {/*Report and manage*/}
          <Grid item xs={12} md={6}>
            <ReportToManage />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography sx={{ mb: 2 }} variant="h4">
          Help us bring missing people to their home.
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid spacing={2} container>
            <Grid item xs={12} md={6}>
              <Signup />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Stack
                  sx={{ mb: 1 }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <LocalPoliceIcon color="primary" />
                  <Typography variant="h5" color="primary">
                    For Authorities
                  </Typography>
                </Stack>
                <Typography variant="body1">
                  Your information will be verified by the administrator.
                  Prepare your credentials to be verified.
                </Typography>
              </Box>
              <Box>
                <Stack
                  sx={{ mb: 1 }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <PeopleIcon color="primary" />
                  <Typography variant="h5" color="primary">
                    For Concerned Citizens
                  </Typography>
                </Stack>
                <Typography variant="body1">
                  If you are an individual or organization who wants to Help
                  find missing people.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {/*Reports */}
    </div>
  );
}
