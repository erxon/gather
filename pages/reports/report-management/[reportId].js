import TabLayout from "@/components/reports/TabLayout";
import { useRouter } from "next/router";
import Calendar from "@/components/reports/ReportManagement/Calendar";
import { CircularProgress, Grid } from "@mui/material";
import Updates from "@/components/reports/ReportManagement/Updates";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import DateAndTimeReported from "@/components/reports/ReportManagement/DateAndTimeReported";

export default function Page() {
  const router = useRouter();
  const { reportId } = router.query;

  const { data, error, isLoading } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong.</Typography>
  if (isLoading) return <CircularProgress />

  return (
    <TabLayout reportId={reportId} index={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DateAndTimeReported reportedAt={data.reportedAt} />
          <Calendar />
        </Grid>
        <Grid item xs={12} md={8}>
          <Updates />
        </Grid>
      </Grid>
    </TabLayout>
  );
}
