import { fetcher } from "@/lib/hooks";
import StackRowLayout from "@/utils/StackRowLayout";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { PieChart } from "react-minimal-pie-chart";

function FoundPersonRatio({ found, close }) {
  const foundReports = Math.round((found / close) * 100);
  const notFoundReports = Math.round(((close - found) / close) * 100);

  const chartData = [
    {
      title: "Found",
      value: foundReports,
      color: "#00696e",
    },
    {
      title: "Not found",
      value: notFoundReports,
      color: "#afafaf",
    },
  ];

  return (
    <PieChart
      animate={true}
      lineWidth={50}
      label={({ dataEntry }) => `${dataEntry.title} ${dataEntry.value}% `}
      labelStyle={{
        fontSize: "4px",
        fill: "#ffffff",
        fontFamily: "Inter",
      }}
      labelPosition={75}
      data={chartData}
    />
  );
}

function Time({ close }) {
  const { data, isLoading, error } = useSWR(
    "/api/data-summary/time-insight",
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography variant="body2">Something went wrong.</Typography>;

    console.log(data)
  const within24hrs = Math.round((data.withinADay / close) * 100);
  const above24hrs = Math.round((data.notFoundWithinADay / close) * 100);

  const chartData = [
    {
      title: "<= 24 hrs",
      value: within24hrs,
      color: "#00696e",
    },
    {
      title: "> 24 hrs",
      value: above24hrs,
      color: "#afafaf",
    },
  ];

  console.log(chartData)

  return (
    <PieChart
      animate={true}
      lineWidth={50}
      label={({ dataEntry }) => `${dataEntry.title} ${dataEntry.value}% `}
      labelStyle={{
        fontSize: "4px",
        fill: "#ffffff",
        fontFamily: "Inter",
      }}
      labelPosition={75}
      data={chartData}
    />
  );
}

function Values({ title, value, variant }) {
  return (
    <StackRowLayout spacing={1}>
      <Typography variant={variant} sx={{ fontWeight: "bold" }}>
        {`${title}: `}{" "}
      </Typography>{" "}
      <Typography variant={variant}>{value}</Typography>
    </StackRowLayout>
  );
}

export default function ReportsSummary() {
  const { data, isLoading, error } = useSWR(
    "/api/data-summary/reports",
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography variant="body2">Something went wrong.</Typography>;

  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Typography variant="h6">Reports Summary</Typography>
      <Box sx={{ mt: 1 }}>
        <Values title={"Total"} value={data.total} variant={"body1"} />
        <Divider sx={{ my: 2 }} />
        <Values title={"Pending"} value={data.pending} variant={"body2"} />
        <Values title={"Active"} value={data.active} variant={"body2"} />
        <Values title={"Close"} value={data.close} variant={"body2"} />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 300, p: 1 }}>
            <FoundPersonRatio found={data.found} close={data.close} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 300, p: 1 }}>
            <Time close={data.close} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
