import QueryPhoto from "@/components/photo/QueryPhoto";
import InfoCard from "@/components/reporter/InfoCard";
import { fetcher } from "@/lib/hooks";
import { CircularProgress, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";

const getImage = async (photoId) => {
  const image = await fetch(`/api/photos/${photoId}`);
  const result = await image.json();

  return result.image;
};

export default function Page() {
  const router = useRouter();
  const { photoUploadedId } = router.query;
  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photoUploadedId}`,
    fetcher
  );

  const handleReport = async () => {
    const image = await getImage(photoUploadedId);

    const createReport = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporter: data._id,
        photo: `query-photos/${image}`,
        reportedAt: data.createdAt,
        status: "pending"
      }),
    });

    if (createReport.status === 200) {
      const result = await createReport.json();
      router.push(`/reports/no-matches/${result.data._id}`);
    }
  };

  if (error)
    return <Typography>Something went wrong fetching uploader.</Typography>;
  if (isLoading) return <CircularProgress />;

  const reportedDate = new Date(data.createdAt);
  const dateString = reportedDate.toDateString();
  const timeString = reportedDate.toLocaleTimeString();

  return (
    <Box sx={{ m: "auto" }}>
      <Typography>
        <InfoCard
          photoUploaded={photoUploadedId}
          createdAt={data.createdAt}
          firstName={data.firstName}
          lastName={data.lastName}
          contactNumber={data.contactNumber}
          email={data.email}
          dateString={dateString}
          timeString={timeString}
        />
        <Button sx={{mt: 1}} variant="contained" onClick={handleReport}>Proceed</Button>
      </Typography>
    </Box>
  );
}
