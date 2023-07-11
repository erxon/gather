import { useRouter } from "next/router";
import { CircularProgress, Typography } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

export default function Page() {
  const router = useRouter();
  const { reportId } = router.query;
  const { data, error, isLoading } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching report.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Typography>
  );
}
