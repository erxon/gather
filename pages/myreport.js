import { useUser } from "@/lib/hooks";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Router, { useRouter } from "next/router";
import AddReportForm from "@/components/myreports/AddReportForm";
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
  Collapse,
  Grid,
} from "@mui/material";
import ReportPhoto from "@/components/photo/ReportPhoto";
import StackRow from "@/utils/StackRow";

import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import Head from "@/components/Head";
import AddIcon from "@mui/icons-material/Add";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import StackRowLayout from "@/utils/StackRowLayout";
import CloseIcon from "@mui/icons-material/Close";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import ErrorAlert from "@/components/ErrorAlert";
import ReportCard from "@/components/reports/ReportCard";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function GetReport(props) {
  const [openAddReportForm, setAddReportForm] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/reports/user/${props.username}`,
    fetcher
  );

  if (error) return <div>failed to load </div>;
  if (isLoading) return <CircularProgress />;
  if (data.data.length === 0)
    return (
      <div>
        <Typography variant="body1" color="GrayText">
          You have no reports
        </Typography>
        <Button
          onClick={() => {
            setAddReportForm(true);
          }}
          sx={{ my: 2 }}
          startIcon={<AddIcon />}
          variant="contained"
        >
          Add report
        </Button>
        <Collapse in={openAddReportForm}>
          <AddReportForm
            userId={props.userId}
            username={props.username}
            handleClose={() => {
              setAddReportForm(false);
            }}
          />
        </Collapse>
      </div>
    );

  return (
    <>
      <Button
        onClick={() => {
          setAddReportForm(true);
        }}
        sx={{ my: 2 }}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Add report
      </Button>
      <Collapse sx={{ mb: 1 }} in={openAddReportForm}>
        <AddReportForm
          userId={props.userId}
          username={props.username}
          handleClose={() => {
            setAddReportForm(false);
          }}
        />
      </Collapse>
      <Grid container spacing={2}>
        {data.data.map((report) => {
          return (
            <Grid key={report._id} item xs={12} md={3}>
              <ReportCard
                key={report._id}
                id={report._id}
                photo={report.photo}
                firstName={report.firstName}
                lastName={report.lastName}
                lastSeen={report.lastSeen}
                age={report.age}
                status={report.status}
                gender={report.gender}
              />
            </Grid>
          );
        })}
      </Grid>
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
          <Head title="Your Reports" icon={<ArticleIcon />} />
          <Box sx={{ my: 3 }}>
            <GetReport username={user.username} userId={user._id} />
          </Box>
        </Box>
      </>
    );
}
