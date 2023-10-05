import {
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import StackRowLayout from "@/utils/StackRowLayout";

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

export default function ReportCard(props) {
  const route = `/reports/${props.id}`;
  let statusStyle = getStatusStyle(props.status);
  let image;
  if (props.photo) {
    image = new CloudinaryImage(props.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    }).resize(fill().width(300).height(200));
  }

  return (
    <Card>
      {image ? (
        <CardMedia
          sx={{
            textAlign: "center",
            backgroundColor: "#F2F4F4",
            height: 200,
          }}
        >
          <AdvancedImage cldImg={image} />
        </CardMedia>
      ) : (
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
      )}
      <CardContent>
        <Box sx={{mb: 0.75}}>
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
