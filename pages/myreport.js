import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import useSWR from "swr";
import Router, { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  CardMedia,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import ReportPhoto from "@/components/photo/ReportPhoto";
import StackRow from "@/utils/StackRow";

import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Report(props) {
  return (
    <>
      <Box>
        <Card sx={{ maxWidth: "300px" }}>
          {props.photo ? (
            <CardMedia sx={{ width: "100%", height: 200, textAlign: "center" }}>
              <ReportPhoto publicId={`report-photos/${props.photo}`} />
            </CardMedia>
          ) : (
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                height: "200px",
              }}
            ></Box>
          )}
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {props.firstName} {props.lastName}
              </Typography>
              <Chip label={props.status} size="small" color="secondary" />
            </Box>
            <StackRow>
              <PlaceIcon />
              <Typography variant="body2">{props.lastSeen}</Typography>
            </StackRow>
            <StackRow>
              <PersonIcon />
              <Typography variant="body2">
                {props.gender}, {props.age}
              </Typography>
            </StackRow>
          </CardContent>
          <CardActions>
            <Button fullWidth variant="contained" href={`/reports/${props.id}`}>
              View
            </Button>
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
  console.log(props.username)

  if (error) return <div>failed to load </div>;
  if (isLoading) return <CircularProgress />;

  return (
    <>
      {data.data.map((report) => {
        return (
          <Report
            key={report._id}
            id={report._id}
            photo={report.photoId.publicId}
            firstName={report.firstName}
            lastName={report.lastName}
            lastSeen={report.lastSeen}
            age={report.age}
            status={report.status}
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
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user)
    return (
      <>
        <Box>
          <Typography variant="h5">Your Reports</Typography>
          <Box sx={{ my: 3 }}>
            <GetReport username={user.username} />
          </Box>
        </Box>
      </>
    );
}
