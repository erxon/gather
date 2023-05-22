import { useUser } from "@/lib/hooks";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArticleIcon from "@mui/icons-material/Article";

import { useRouter } from "next/router";
import { useEffect } from "react";

//components
import ActiveReports from "@/components/reports/ActiveReports";
import NotificationsMain from "@/components/notifications/NotificationsMain";
import Data from "@/components/Data";

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

  return (
    <>
      <Box>
        <Typography variant="h5">Dashboard</Typography>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Active Reports</Typography>
              <Box sx={{my: 2}}>
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Notifications</Typography>
              <NotificationsMain />
            </Paper>
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography sx={{ mb: 3 }} variant="h6">
                Data
              </Typography>
              <Box sx={{ width: 300, margin: "auto" }}>
                <Data />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
