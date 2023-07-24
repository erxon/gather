import {
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import StackRowLayout from "@/utils/StackRowLayout";

export default function ReportCard(props) {
  const route = `/reports/${props.id}`;
  let image;
  if (props.photo) {
    image = new CloudinaryImage(props.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    }).resize(fill().height(300));
  }
  return (
    <Card>
      {image ? (
        <CardMedia
          sx={{
            textAlign: "center",
            backgroundColor: "#F2F4F4",
            height: 300
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
            height: 300,
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
        <StackRowLayout spacing={1.25}>
          {props.lastName && props.firstName ? (
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {props.firstName} {props.lastName}
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Unknown
            </Typography>
          )}
          <Chip
            sx={{ mt: 2 }}
            variant="filled"
            color="success"
            label={props.status}
            size="small"
          />
        </StackRowLayout>
        <StackRowLayout spacing={1}>
          <PersonIcon color="disabled" />
          {props.age && props.gender ? (
            <Typography color="GrayText" variant="body1">
              {props.age}, {props.gender}
            </Typography>
          ) : (
            <Typography color="GrayText" variant="body1">
              Unknown
            </Typography>
          )}
        </StackRowLayout>
        <StackRowLayout spacing={1}>
          <PlaceIcon color="disabled" />
          {props.location ? (
            <Typography color="GrayText" variant="body1">
              {props.location}
            </Typography>
          ) : (
            <Typography color="GrayText" variant="body1">
              {props.lastSeen}
            </Typography>
          )}
        </StackRowLayout>

        <CardActions sx={{ p: 0, mt: 2 }}>
          <Button variant="contained" fullWidth href={route}>
            View
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
