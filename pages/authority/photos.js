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
import { fetcher, useUser } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import IconTypography from "@/utils/layout/IconTypography";
//Icons
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import Head from "@/components/Head";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useRouter } from "next/router";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";

function UploadedPhoto({ photoId }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    const startDate = new Date(data.createdAt)
    const timeElapsed = computeElapsedTime(startDate);

    return (
      <Box>
        <QueryPhoto publicId={data.image} />
        <Typography variant="body2" color="GrayText">Uploaded {timeElapsed}</Typography>
      </Box>
    );
  }
}

function Reporter(props) {
  const { name, contact, email } = props;
  return (
    <Box>
      <Typography sx={{ mb: 1.5 }} variant="body1">
        Reported by {name}
      </Typography>
      <IconTypography
        customStyles={{ mb: 0.5 }}
        Icon={<LocalPhoneIcon htmlColor="GrayText" />}
        content={contact}
      />
      <IconTypography
        Icon={<EmailIcon htmlColor="GrayText" />}
        content={email}
      />
    </Box>
  );
}

function Report(props) {
  const router = useRouter();
  return (
    <Grid item xs={12} md={3} sm={6}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <CardMedia sx={{ textAlign: "center" }}>
          <UploadedPhoto photoId={props.photoUploaded} />
        </CardMedia>
        <CardContent>
          <Reporter
            name={`${props.firstName} ${props.lastName}`}
            contact={props.contactNumber}
            email={props.email}
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              router.push(`/authority/matches/${props.photoUploaded}`)
            }
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
        <Head title="Photos" icon={<InsertPhotoIcon />} />
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
