/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/
import React from "react";
import Router from "next/router";
import { useEffect, useState } from "react";
import { fetcher, useUser } from "@/lib/hooks";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";

import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";
import useSWR from "swr";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import TabLayout from "@/components/reports/TabLayout";

//Components
import ReportInformation from "@/components/reports/ReportPage/ReportInformation";
import ReportProcessing from "@/components/reports/ReportPage/ReportProcessing";
import ReportProcessLogs from "@/components/reports/ReportPage/ReportProcessLogs";

export default function ReportPage({ data }) {
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const [authorized, isAuthorized] = useState(false);

  //Checks if the user is authorized
  useEffect(() => {
    if (!user) {
      return;
    } else {
      if (user.username === data.username || user.type === "authority") {
        isAuthorized(true);
      } else {
        isAuthorized(false);
      }
    }
  }, [user, data.username, loading]);

  if (loading) return <CircularProgress />;

  //Delete report
  const handleDelete = async () => {
    const res = await deleteReport(data._id);
    console.log(res);
    if (res === 200) {
      Router.push("/reportDashboard");
    }
  };

  return (
    <>
      <TabLayout reportId={data._id} index={0}>
        <Box>
          {authorized && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                router.push(`/reports/edit/${data._id}`);
              }}
              size="small"
            >
              Edit
            </Button>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography>Editted by: </Typography>
            <Typography>September 4, 2023</Typography>
          </Box>
          <Box>
            {user.type === "authority" &&
              user.role === "reports administrator" && (
                <ReportProcessing currentUser={user} report={data} />
              )}
          </Box>
          {/*Basic Information */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <ReportInformation data={data} user={user} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{mt: 3}}>
              <ReportProcessLogs report={data} user={user} reportId={data._id} /></Box>
            </Grid>
          </Grid>
        </Box>
      </TabLayout>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;

  //Get single report
  const data = await getSingleReport(rid);
  console.log(data);
  return {
    props: { data },
  };
};
