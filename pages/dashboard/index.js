import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
  Stack,
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
import SearchBarReports from "@/components/searchBars/SearchBarReports";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import ReportOverview from "@/components/reports/ReportManagement/ReportOverview";

function DashboardMain({ user, mutate }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    mutate({});
  };

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }} spacing={1}>
        <DashboardIcon fontSize="large" />
        <Typography sx={{ mr: 3 }} variant="h4">
          Dashboard
        </Typography>
      </Stack>
      <SearchBarReports />
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
        <Grid item xs={12} sm={12} md={7}>
          <ReportOverview username={user.username} />

          <Paper sx={{ p: 3 }}>
            <Typography sx={{ mb: 2 }} variant="h6">
              Active reports
            </Typography>
            <ActiveReports />
            <Button href="/reports" size="small">
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
        <Grid item xs={12} md={5}>
          {user.status === "verified" && (
            <Paper sx={{p: 3, height: 700}}>
              <Typography sx={{mb: 2}} variant="h6">Updates</Typography>
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
  }, [user, loading, router]);

  if (loading) return <CircularProgress />;
  if (user) return <DashboardMain mutate={mutate} user={user} />;
}
