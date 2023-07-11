import { useRouter } from "next/router";
import { fetcher } from "@/lib/hooks";
import useSWR from "swr";
import { CircularProgress, Typography } from "@mui/material";
import InfoCard from "@/components/reporter/InfoCard";

export default function Page() {
  const router = useRouter();
  const { photoUploaded } = router.query;

  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photoUploaded}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching reporter.</Typography>;
  if (isLoading) return <CircularProgress />;

  const reportedDate = new Date(data.createdAt);
  const dateString = reportedDate.toDateString();
  const timeString = reportedDate.toLocaleTimeString();

  return (
    <InfoCard
      photoUploaded={photoUploaded}
      createdAt={data.createdAt}
      firstName={data.firstName}
      lastName={data.lastName}
      contactNumber={data.contactNumber}
      email={data.email}
      dateString={dateString}
      timeString={timeString}
    />
  );
}
