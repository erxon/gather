import {
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import StackRowLayout from "@/utils/StackRowLayout";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

const getStatusStyle = (status) => {
  let style;

  switch (status) {
    case "pending":
      style = {
        bgcolor: "#c7c7c7",
      };
      break;
    case "under verification":
      style = {
        bgcolor: "#1164bd",
        color: "#fff",
      };
      break;
    case "active":
      style = {
        bgcolor: "#5beb5e",
      };
      break;
    case "close":
      style = { bgcolor: "#141414", color: "#fff" };
      break;
    case "archive":
      style = { bgcolor: "#c7c7c7" };
      break;
  }

  return style;
};

function ReportPhoto({ publicId }) {
  const image = new CloudinaryImage(publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(300).height(200));

  return <AdvancedImage cldImg={image} />;
}

function ExistingImage({ photoId }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);

  if (error)
    return (
      <Typography variant="body2">
        Something went wrong fetching photo
      </Typography>
    );
  if (isLoading) return <CircularProgress />;

  return <ReportPhoto publicId={`query-photos/${data.image}`} />;
}

function DisplayReportPhoto({ photo, photoId }) {
  if (photo) {
    return (
      <CardMedia
        sx={{
          textAlign: "center",
          backgroundColor: "#F2F4F4",
          height: 200,
        }}
      >
        <ReportPhoto publicId={photo} />
      </CardMedia>
    );
  } else if (photoId) {
    return (
      <CardMedia
        sx={{
          textAlign: "center",
          backgroundColor: "#F2F4F4",
          height: 200,
        }}
      >
        <ExistingImage photoId={photoId} />
      </CardMedia>
    );
  } else {
    return (
      <CardMedia
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          backgroundColor: "#F2F4F4",
        }}
      >
        <InsertPhotoIcon color="disabled" />
        <Typography color="GrayText" variant="subtitle1">
          No photo
        </Typography>
      </CardMedia>
    );
  }
}

export default function ReportCard(props) {
  const route = `/reports/${props.id}`;
  let statusStyle = getStatusStyle(props.status);

  return (
    <Card>
      <DisplayReportPhoto photoId={props.photoId} photo={props.photo} />
      <CardContent>
        <Box sx={{ mb: 0.75 }}>
          <StackRowLayout spacing={1.25}>
            {props.lastName && props.firstName ? (
              <Typography sx={{ fontWeight: "bold" }}>
                {props.firstName} {props.lastName}
              </Typography>
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>Unknown</Typography>
            )}
            <Chip
              sx={{ ...statusStyle }}
              variant="filled"
              label={props.status}
              size="small"
            />
          </StackRowLayout>
        </Box>
        <StackRowLayout spacing={1}>
          <PersonIcon fontSize="small" />
          {props.age && props.gender ? (
            <Typography variant="body2">
              {props.age}, {props.gender}
            </Typography>
          ) : (
            <Typography variant="body2">Unknown</Typography>
          )}
        </StackRowLayout>
        <StackRowLayout spacing={1}>
          <PlaceIcon fontSize="small" />
          {props.location ? (
            <Typography variant="body2">{props.location}</Typography>
          ) : (
            <Typography variant="body2">{props.lastSeen}</Typography>
          )}
        </StackRowLayout>

        <CardActions sx={{ p: 0, mt: 2 }}>
          <Button href={route}>View</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
