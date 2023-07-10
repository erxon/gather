import { CircularProgress, Typography, Stack, Box } from "@mui/material";
import useSWR from "swr";
import { PieChart } from "react-minimal-pie-chart";
import { fetcher } from "@/lib/hooks";
import StackRowLayout from "@/utils/StackRowLayout";

export default function Data() {
  const { data, error, isLoading } = useSWR("/api/data-summary", fetcher);

  if (error)
    return <Typography>Something went wrong fetching data.</Typography>;
  if (isLoading) return <CircularProgress />;

  const activeReportsPercentage = (data.activeReports / data.allReports) * 100;
  const closedReportsPercentage = (data.closedReports / data.allReports) * 100;

  const chartData = [
    {
      title: "Active",
      value: activeReportsPercentage,
      color: "#00696e",
    },
    {
      title: "Closed",
      value: closedReportsPercentage,
      color: "#afafaf",
    },
  ];

  return (
    <div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "left", md: "center" }}
        spacing={2}
      >
        <Box>
          <Box>
            <Typography component="label" variant="subtitle2">
              Active reports
            </Typography>
            <Typography variant="h3">{data.activeReports}</Typography>
          </Box>
          <Box>
            <Typography component="label" variant="subtitle2">
              Found
            </Typography>
            <Typography variant="h3">{data.foundMissingPersons}</Typography>
          </Box>
          <Box>
            <Typography component="label" variant="subtitle2">
              Verified users
            </Typography>
            <Typography variant="h3">{data.users}</Typography>
          </Box>
        </Box>
        <Box sx={{ p: 1, width: 300 }}>
          <PieChart
            animate={true}
            lineWidth={50}
            label={({ dataEntry }) => `${dataEntry.value}% `}
            labelStyle={{
              fontSize: "8px",
              fill: "#ffffff",
              fontFamily: "sans-serif",
            }}
            labelPosition={75}
            data={chartData}
          />
        </Box>
        <Box>
          <Typography>Legend</Typography>
          <StackRowLayout spacing={1}>
            <Box
              sx={{ height: 10, width: 10, backgroundColor: "#00696e" }}
            ></Box>
            <Typography variant="subtitle2">Active Cases</Typography>
          </StackRowLayout>
          <StackRowLayout spacing={1}>
            <Box
              sx={{ height: 10, width: 10, backgroundColor: "#afafaf" }}
            ></Box>
            <Typography variant="subtitle2">Closed cases</Typography>
          </StackRowLayout>
        </Box>
      </Stack>
    </div>
  );
}
