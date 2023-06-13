import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

import { Router, useRouter } from "next/router";
import { useEffect } from "react";

//components
import ActiveReports from "@/components/reports/ActiveReports";
import NotificationsMain from "@/components/notifications/NotificationsMain";
import Data from "@/components/Data";
import { useUser } from "@/lib/hooks";
import Head from "@/components/Head";

function DashboardMain(user) {
  return (
    <>
      <Head title="Dashboard" />
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper sx={{ p: 3 }} variant="outlined">
            <Typography variant="h6">Active Reports</Typography>
            <Box sx={{ my: 2 }}>
              <ActiveReports />
            </Box>
            <Button
              href="/reports"
              size="small"
              variant="contained"
              disableElevation
            >
              View All
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {user.type === "authority" && (
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography variant="h6">Notifications</Typography>
              <NotificationsMain />
            </Paper>
          )}
          <Paper
            sx={user.type === "authority" ? { p: 3, mt: 3 } : { p: 3 }}
            variant="outlined"
          >
            <Typography sx={{ mb: 3 }} variant="h6">
              Data
            </Typography>
            <Box sx={{ width: 300, margin: "auto" }}>
              <Data />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [user, { loading }] = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user) return <DashboardMain user={user} />;
}
