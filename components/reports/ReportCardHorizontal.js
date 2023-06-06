import { Card, CardMedia, CardContent, Stack, Typography } from "@mui/material";
import Image from "next/image";
//Icons
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function StackLayout({ children, customStyles }) {
  return (
    <Stack sx={customStyles} direction="row" spacing={0.5} alignItems="center">
      {children}
    </Stack>
  );
}

export default function ReportCardHorizontal(props) {
  return (
    <Card sx={{ display: "flex" }}>
      <CardMedia sx={{ width: "150", height: "150" }}>
        <Image width="150" height="150" src="/assets/placeholder.png" />
      </CardMedia>
      <CardContent>
        <Typography>{props.distance}</Typography>
        <Typography sx={{ mb: 1 }} variant="h5">
          John Doe
        </Typography>
        <StackLayout customStyles={{ mb: 0.25 }}>
          <PersonIcon color="secondary" />
          <Typography variant="body2" color="secondary">
            15 years old, Male
          </Typography>
        </StackLayout>
        <StackLayout customStyles={{ mb: 0.25 }}>
          <PlaceIcon color="secondary" />
          <Typography variant="body2" color="secondary">
            Last seen at Jollibee Manggahan
          </Typography>
        </StackLayout>
        <StackLayout customStyles={{ mb: 0.25 }}>
          <CalendarTodayIcon color="secondary" />
          <Typography variant="body2" color="secondary">
            Reportedly missing on 11th day of June 2023
          </Typography>
        </StackLayout>
      </CardContent>
    </Card>
  );
}
