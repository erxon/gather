/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/
import React from "react";
import Router from "next/router";
import { useEffect, useState } from "react";
import { fetcher, useUser } from "@/lib/hooks";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  Paper,
} from "@mui/material";

import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import TabLayout from "@/components/reports/TabLayout";

//Components
import ReportInformation from "@/components/reports/ReportPage/ReportInformation";
import ReportProcessing from "@/components/reports/ReportPage/ReportProcessing";
import ReportProcessLogs from "@/components/reports/ReportPage/ReportProcessLogs";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import Image from "next/image";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function UpdatedBy({ updatedBy, updatedAt }) {
  const dateUpdated = new Date(updatedAt);
  const timeElapsed = computeElapsedTime(dateUpdated);
  const router = useRouter();
  const { _id, photo, username, firstName, lastName, type } = updatedBy;

  const handleRoute = () => {
    router.push(`/profile/${_id}`);
  };

  return (
    <Paper sx={{ p: 1, maxWidth: 300 }} variant="outlined">
      <Typography sx={{ mb: 1 }} variant="body2">
        Updated by
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box>
          {photo ? (
            <ProfilePhoto publicId={photo} />
          ) : (
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "100%" }}
              alt="placeholder for profile photo"
              src="/assets/placeholder.png"
            />
          )}
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontWeight: "bold" }} variant="body2">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2">{timeElapsed}</Typography>
          </Stack>
          <Typography sx={{ color: "GrayText" }} variant="body2">
            {username}
          </Typography>
        </Box>
      </Stack>
      <Button
        onClick={handleRoute}
        sx={{ mt: 1 }}
        startIcon={<AccountCircleIcon />}
        size="small"
      >
        View Profile
      </Button>
    </Paper>
  );
}

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
      <TabLayout
        userType={user && user.type}
        userId={user && user._id}
        reportOwner={data.account}
        reportId={data._id}
        index={0}
      >
        <Box>
          {user &&
            ((data.editors.length > 0 && data.editors.includes(user._id)) ||
              user.role === "reports administrator") && (
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
          {data.updatedBy && (
            <Box sx={{ mt: 3 }}>
              <UpdatedBy
                updatedBy={data.updatedBy}
                updatedAt={data.updatedAt}
              />
            </Box>
          )}
          <Box>
            {user &&
              ((user.type === "authority" &&
                user.role === "reports administrator") ||
                user._id === data.assignedTo) && (
                <ReportProcessing currentUser={user} report={data} />
              )}
          </Box>
          {/*Basic Information */}
          {user &&
          (user._id === data.account ||
            user.role === "reports administrator" ||
            user.type === "authority") ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <ReportInformation
                  authorized={authorized}
                  data={data}
                  user={user}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mt: 3 }}>
                  <ReportProcessLogs
                    report={data}
                    user={user}
                    reportId={data._id}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <ReportInformation
              authorized={authorized}
              data={data}
              user={user}
            />
          )}
        </Box>
      </TabLayout>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;

  //Get single report
  const data = await getSingleReport(rid);

  return {
    props: { data },
  };
};
