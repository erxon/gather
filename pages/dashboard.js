import { useUser } from "@/lib/hooks";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArticleIcon from "@mui/icons-material/Article";

import { useRouter } from "next/router";
import { useEffect } from "react";

//components
import ActiveReports from "@/components/reports/ActiveReports";

export default function Dashboard() {
  const router = useRouter();
  const [user, { loading }] = useUser();

  useEffect(() => {
    fetch("/api/user/checkAuth").then((response) => {
      response.json().then((data) => {
        if (!data.authenticated) {
          return router.push("/login");
        }
      });
    });
  }, [user]);

  const boxStyles = {
    backgroundColor: "#F2F4F4",
    padding: "28px 30px 28px 30px",
    borderRadius: "20px",
  };

  return (
    <>
      <Box>
        <Typography>Dashboard</Typography>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6}>
            <Box sx={boxStyles}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DonutLargeIcon />
                <Typography variant="h6">Data</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={boxStyles}>
              <Stack direction="row" spacing={1} alignItems="center">
                <NotificationsIcon />
                <Typography variant="h6">Notifications</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={boxStyles}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArticleIcon />
                <Typography variant="h6">Active Reports</Typography>
              </Stack>
              <Box sx={{ my: 5 }}>
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
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
