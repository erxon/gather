import Head from "@/components/Head";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FolderIcon from "@mui/icons-material/Folder";

import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import {
  Button,
  CircularProgress,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import ContentLayout from "@/utils/layout/ContentLayout";

function Report({ report }) {
  const router = useRouter();
  return (
    <div>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <FolderIcon color="primary" />
        <Typography sx={{ fontWeight: "bold" }}>
          {report.firstName} {report.lastName}
        </Typography>
        {/*Put resolution here, found or not found */}
        <Typography sx={{ mb: 1 }} variant="body2">
          Result: {report.result}
        </Typography>
        <Typography variant="body2">
          State when found: {report.state}
        </Typography>

        <Button
          onClick={() => router.push(`/reports/${report._id}`)}
          sx={{ mt: 2 }}
          size="small"
        >
          View
        </Button>
      </Paper>
    </div>
  );
}

function ArchivedReports() {
  //fetch all archived reports
  const { data, error, isLoading } = useSWR("/api/reports/archives", fetcher);

  if (error)
    return (
      <Typography>Something went wrong fetching archived reports.</Typography>
    );
  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <Grid container spacing={0.5}>
        {data.length > 0 ? (
          data.map((report) => {
            return (
              <Grid key={report._id} item xs={12} md={4} sm={6}>
                <Report report={report} />
              </Grid>
            );
          })
        ) : (
          <Typography color="GrayText">
            There were no archived reports.
          </Typography>
        )}
      </Grid>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <ContentLayout>
        <Head title="Archived Reports" icon={<Inventory2OutlinedIcon />} />
        <ArchivedReports />
      </ContentLayout>
    </div>
  );
}
