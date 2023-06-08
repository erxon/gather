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
  Grid,
  Divider,
} from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import IconTypography from "@/utils/layout/IconTypography";
//Icons
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

function UploadedPhoto({ photoId }) {
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

function Report(props) {
  return (
    <Grid item xs={12} md={3} sm={6}>
      <Card sx={{ maxWidth: "300px" }} variant="outlined">
        <CardMedia sx={{ textAlign: "center" }}>
          <UploadedPhoto photoId={props.photoUploaded} />
        </CardMedia>
        <CardContent>
          <Typography sx={{ mb: 2 }} variant="h5">
            Reporter
          </Typography>
          <Reporter
            name={`${props.firstName} ${props.lastName}`}
            contact={props.contactNumber}
            email={props.email}
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            href={`/authority/matches/${props.photoUploaded}`}
          >
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

function Reports() {
  const { data, error, isLoading } = useSWR("/api/reporters", fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    const reporters = data.data;
    return (
      <Box>
        <Box sx={{mb: 3}}>
          <Typography variant="h5">Photos submitted</Typography>
          <Divider />
        </Box>
        <Grid container spacing={1.25}>
          {reporters.map((reporter) => {
            return (
              <Report
                key={reporter._id}
                photoUploaded={reporter.photoUploaded}
                firstName={reporter.firstName}
                lastName={reporter.lastName}
                contactNumber={reporter.contactNumber}
                email={reporter.email}
              />
            );
          })}
        </Grid>
      </Box>
    );
  }
}

export default function Page() {
  return (
    <Authenticate>
      <Reports />
    </Authenticate>
  );
}
