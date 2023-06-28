import Head from "@/components/Head";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FolderIcon from "@mui/icons-material/Folder";

import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";

function Report({ report }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `/api/reports/${report.report}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching report.</Typography>;
  if (isLoading) return <CircularProgress />;

  console.log(data);
  return (
    <div>
      <Paper variant="outlined" sx={{ width: 300, p: 3 }}>
        <FolderIcon color="primary" />
        <Typography sx={{ fontWeight: "bold" }}>
          {data.firstName} {data.lastName}
        </Typography>
        {/*Put resolution here, found or not found */}
        <Typography sx={{ mb: 1 }} variant="body2">
          Found
        </Typography>
        <Typography variant="body2">
          Last known location {data.lastSeen}
        </Typography>

        <Button
          onClick={() => router.push(`/reports/${data._id}`)}
          sx={{ mt: 2 }}
          size="small"
          variant="outlined"
        >
          View
        </Button>
      </Paper>
    </div>
  );
}

function ArchivedReports() {
  //fetch all archived reports
  const { data, error, isLoading } = useSWR("/api/archives", fetcher);

  if (error)
    return (
      <Typography>Something went wrong fetching archived reports.</Typography>
    );
  if (isLoading) return <CircularProgress />;
  if (data) {
    return (
      <div>
        {data.map((report) => {
          return <Report key={report._id} report={report} />;
        })}
      </div>
    );
  }
}

export default function Page() {
  return (
    <div>
      <Head title="Archived Reports" icon={<Inventory2OutlinedIcon />} />
      <ArchivedReports />
    </div>
  );
}
