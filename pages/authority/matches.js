import { Box, Typography, Paper, Grid } from "@mui/material";
import Image from "next/image";
import ReportCardHorizontal from "@/components/reports/ReportCardHorizontal";
import Authenticate from "@/utils/authority/Authenticate";

function RenderMatches() {
  return (
    <Box>
      <Typography>Matches will be displayed here</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }} variant="outlined">
            <Typography sx={{ mb: 1.5 }}>Photo</Typography>
            <Image width="150" height="150" src="/assets/placeholder.png" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ mb: 1.5 }}>Possible matches</Typography>
            <ReportCardHorizontal distance={"Distance: 10%"} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Matches() {
  return (
    <Authenticate>
      <RenderMatches />
    </Authenticate>
  );
}
