import Authenticate from "@/utils/authority/Authenticate";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import IconTypography from "@/utils/layout/IconTypography";
//Icons
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

function Photo({ photoId }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    return <QueryPhoto publicId={data.image} />;
  }
}

function Reporter(props) {
  const { name, contact, email } = props;
  return (
    <Box>
      <IconTypography
        customStyles={{ mb: 0.5 }}
        Icon={<PersonIcon />}
        content={name}
      />
      <IconTypography
        customStyles={{ mb: 0.5 }}
        Icon={<LocalPhoneIcon />}
        content={contact}
      />
      <IconTypography Icon={<EmailIcon />} content={email} />
    </Box>
  );
}

function RenderPhotos() {
  const { data, error, isLoading } = useSWR("/api/reporters", fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    const reporters = data.data;
    return (
      <Box>
        {reporters.map((reporter) => {
          return (
            <Card sx={{ maxWidth: "300px" }}>
              <CardMedia sx={{ textAlign: "center" }}>
                <Photo photoId={reporter.photoUploaded} />
              </CardMedia>
              <CardContent>
                <Typography sx={{ mb: 2 }} variant="h5">
                  Reporter
                </Typography>
                <Reporter
                  name={`${reporter.firstName} ${reporter.lastName}`}
                  contact={reporter.contactNumber}
                  email={reporter.email}
                />
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  href={`/authority/matches/${reporter.photoUploaded}`}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    );
  }
}

export default function Page() {
  return (
    <Authenticate>
      <RenderPhotos />
    </Authenticate>
  );
}
