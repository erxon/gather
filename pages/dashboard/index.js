import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/router";
import { useEffect } from "react";

//components
import ActiveReports from "@/components/reports/ActiveReports";
import NotificationsMain from "@/components/notifications/NotificationsMain";
import Data from "@/components/Data";
import { useUser } from "@/lib/hooks";
import StackRowLayout from "@/utils/StackRowLayout";

import DashboardIcon from "@mui/icons-material/Dashboard";

function DashboardMain({ user, mutate }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    mutate({});
  };

  return (
    <>
      <StackRowLayout spacing={1}>
        <DashboardIcon />
        <Typography variant="h5">Dashboard</Typography>
      </StackRowLayout>
      {user.status === "unverified" && (
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ mb: 1 }}>
            Your account is not yet verified.
          </Typography>
          <Button
            sx={{ mr: 1 }}
            size="small"
            variant="contained"
            onClick={() => router.push("/profile/completion")}
          >
            Profile
          </Button>
          <Button size="small" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
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
          <Paper
            sx={user.status === "verified" ? { p: 3, mt: 3 } : { p: 3 }}
            variant="outlined"
          >
            <Typography sx={{ mb: 3 }} variant="h6">
              Data
            </Typography>
            <Box>
              <Data />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {user.status === "verified" && (
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography variant="h6">Feeds</Typography>
              <NotificationsMain user={user} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [user, { loading, mutate }] = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user) return <DashboardMain mutate={mutate} user={user} />;
}
