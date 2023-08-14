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
      <StackRowLayout spacing={1}>
        <DashboardIcon />
        <Typography sx={{ mr: 3 }} variant="h5">
          Dashboard
        </Typography>
        <SearchBarReports />
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
          <Box
            sx={{
              padding: "3% 5%",
            }}
          >
            <Stack
              direction="row"
              sx={{ mt: 2 }}
              spacing={2}
              alignItems="center"
            >
              <AssignmentIndOutlinedIcon />
              <Typography variant="h6">Report overview</Typography>
            </Stack>
            <Box sx={{ my: 4 }}>
              <ReportOverview username={user.username} />
            </Box>
          </Box>
          <Box
            sx={{
              padding: "3% 5%",
            }}
          >
            <Stack
              direction="row"
              sx={{ mt: 2 }}
              spacing={2}
              alignItems="center"
            >
              <ArticleOutlinedIcon />
              <Typography variant="h6">Active reports</Typography>
            </Stack>
            <Box sx={{ my: 4 }}>
              <ActiveReports />
            </Box>
            <Button href="/reports" size="small" variant="contained">
              View All
            </Button>
          </Box>
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
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 4, mb: 2 }}
              >
                <DynamicFeedOutlinedIcon />
                <Typography variant="h6">Feeds</Typography>
              </Stack>

              <NotificationsMain user={user} />
            </Box>
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
