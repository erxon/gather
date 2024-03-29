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
  Pagination,
  Paper,
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
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import { useState } from "react";
import ContentLayout from "@/utils/layout/ContentLayout";

function UploadedPhoto({ photoId }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    const startDate = new Date(data.createdAt);
    const timeElapsed = computeElapsedTime(startDate);

    return (
      <Box sx={{ textAlign: "center" }}>
        <QueryPhotoLarge publicId={data.image} />
        <Typography variant="body2" color="GrayText">
          Uploaded {timeElapsed}
        </Typography>
      </Box>
    );
  }
}

function Reporter(props) {
  const { name, contact, email } = props;
  return (
    <Box>
      <Typography variant="body2">Reported by</Typography>
      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: "bold" }}>{name}</Typography>
      <IconTypography
        customStyles={{ mb: 0.5 }}
        Icon={<LocalPhoneIcon fontSize="small" color="disabled" />}
        content={contact}
      />
      <IconTypography Icon={<EmailIcon fontSize="small" color="disabled" />} content={email} />
    </Box>
  );
}

function Report(props) {
  const router = useRouter();
  return (
    <Grid item xs={12} md={3} sm={6}>
      <Card variant="outlined">
        <CardMedia sx={{ bgcolor: "#F2F4F4" }}>
          <UploadedPhoto photoId={props.photoUploaded} />
        </CardMedia>
        <Box sx={{ p: 2 }}>
          <CardContent sx={{ p: 1 }}>
            <Reporter
              name={`${props.firstName} ${props.lastName}`}
              contact={props.contactNumber}
              email={props.email}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() =>
                router.push(`/authority/matches/${props.photoUploaded}`)
              }
            >
              View
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}

function Reports() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR("/api/reporters", fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;

  const handlePage = (event, value) => {
    setPage(value);
  };

  if (data) {
    const reporters = data.data;

    return (
      <Box>
        <Head title="Photos" icon={<InsertPhotoIcon />} />
        <Pagination
          sx={{ mb: 2 }}
          onChange={handlePage}
          page={page}
          count={reporters.length - 3}
        />
        <Grid container spacing={3}>
          {reporters.length > 0 ? (
            reporters.slice(page - 1, page + 3).map((reporter) => {
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
            })
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography color="GrayText">No photos uploaded yet</Typography>
            </Box>
          )}
        </Grid>
      </Box>
    );
  }
}

export default function Page() {
  return (
    <ContentLayout>
      <Authenticate>
        <Reports />
      </Authenticate>
    </ContentLayout>
  );
}
