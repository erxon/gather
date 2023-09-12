import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import Image from "next/image";
import { useRouter } from "next/router";

function Report({ report }) {
  const { _id, firstName, lastName, age, gender, lastSeen, photo } = report;
  const router = useRouter();

  return (
    <Card sx={{ p: 1.5, my: 1 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box>
          <CardMedia sx={{ p: 1 }}>
            {photo ? (
              <ProfilePhotoAvatar publicId={photo} />
            ) : (
              <Image
                height={56}
                width={56}
                style={{ borderRadius: "100%" }}
                alt="Placeholder image for the report photo"
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
        </Box>
        <Box>
          <CardContent sx={{ p: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "GrayText" }}>
              {age}, {gender}
            </Typography>
            <Typography variant="body2" sx={{ color: "GrayText" }}>
              {lastSeen}
            </Typography>
          </CardContent>
          <CardActions sx={{ p: 1 }}>
            <Button
              onClick={() => {
                router.push(`/reports/${_id}`);
              }}
              size="small"
              variant="outlined"
            >
              View
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
}

export default function AssignedReports({ userId }) {
  const { data, error, isLoading } = useSWR(
    `/api/reports/assigned-to/${userId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  return (
    <Box>
      {data.map((report) => {
        return <Report key={report._id} report={report} />;
      })}
    </Box>
  );
}
