import QueryPhotoSmall from "@/components/photo/QueryPhotoSmall";
import { fetcher } from "@/lib/hooks";
import { Box, CircularProgress, Typography } from "@mui/material";
import useSWR from "swr";

export default function Photo({ photoUploaded }) {
  const { data, error, isLoading } = useSWR(
    `/api/photos/${photoUploaded}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching photo.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <QueryPhotoSmall publicId={data.image} />
    </Box>
  );
}
