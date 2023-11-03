import TabLayout from "@/components/reports/TabLayout";
import { useRouter } from "next/router";
import Calendar from "@/components/reports/ReportManagement/Calendar";
import { CircularProgress, Grid, Typography } from "@mui/material";
import Updates from "@/components/reports/ReportManagement/Updates";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import DateAndTimeReported from "@/components/reports/ReportManagement/DateAndTimeReported";
import { useEffect, useState } from "react";
import ContentLayout from "@/utils/layout/ContentLayout";

export default function Page() {
  const router = useRouter();
  const { reportId } = router.query;

  const [date, setDate] = useState(new Date());
  const { data, error, isLoading } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching reports.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <ContentLayout>
      <TabLayout reportId={reportId} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <DateAndTimeReported reportedAt={data.reportedAt} />
            <Calendar reportedAt={data.reportedAt} setExternalDate={setDate} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Updates date={date} reportId={reportId} />
          </Grid>
        </Grid>
      </TabLayout>
    </ContentLayout>
  );
}
