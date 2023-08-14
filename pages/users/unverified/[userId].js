import Head from "@/components/Head";
import ProfilePhotoLarge from "@/components/photo/ProfilePhotoLarge";
import {
  Box,
  Avatar,
  Typography,
  Stack,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Modal,
  CircularProgress,
} from "@mui/material";
import ValidPhoto from "@/components/profile/CompletionForm/ValidPhoto";
import Link from "next/link";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Photo from "@/components/photo/Photo";

function Layout({ children, title, icon }) {
  return (
    <div>
      <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={1.5}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      {children}
    </div>
  );
}

function ProfilePhoto({ photo }) {
  return (
    <Box sx={{ p: 3 }}>
      <Layout title="Profile photo" icon={<AccountCircleOutlinedIcon />}>
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            backgroundColor: "#f2f4f4",
            borderRadius: 5,
          }}
        >
          {photo ? (
            <ProfilePhotoLarge publicId={photo} />
          ) : (
            <div>
              <Avatar
                sx={{ width: 150, height: 150, m: "auto" }}
                src="/assets/placeholder.png"
              />
            </div>
          )}
        </Box>
      </Layout>
    </Box>
  );
}

function DisplayValidPhoto({ photo }) {
  const [enlargePhoto, setEnlargePhoto] = useState(false);

  return (
    <div>
      <Modal
        open={enlargePhoto}
        onClose={() => {
          setEnlargePhoto(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Photo publicId={photo} />
        </Box>
      </Modal>
      <Box sx={{ p: 3 }}>
        <Layout title="Valid photo" icon={<PhotoOutlinedIcon />}>
          <Box
            sx={{
              py: 3,
              textAlign: "center",
              backgroundColor: "#f2f4f4",
              borderRadius: 5,
            }}
          >
            {photo ? (
              <Button
                onClick={() => {
                  setEnlargePhoto(true);
                }}
              >
                <ValidPhoto publicId={photo} />
              </Button>
            ) : (
              <Box
                sx={{
                  m: "auto",
                  backgroundColor: "#f2f4f4",
                  width: 300,
                  height: 200,
                }}
              >
                <Typography variant="body2" color="GrayText">
                  No valid photo uploaded.
                </Typography>
              </Box>
            )}
          </Box>
        </Layout>
      </Box>
    </div>
  );
}

function ContentLayout({ title, children, icon }) {
  return (
    <Box sx={{ my: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {icon}
        <Typography color="GrayText" component="label" variant="body2">
          {title}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

function Content({ user }) {
  return (
    <div>
      <Paper sx={{ p: 4, mb: 3 }} variant="outlined">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PeopleOutlineOutlinedIcon />
          <Typography variant="h6">Social media accounts</Typography>
        </Stack>
        <ContentLayout
          title="Facebook"
          icon={<FacebookOutlinedIcon color="disabled" />}
        >
          {user.socialMediaAccounts.facebook !== "" ? (
            <Typography sx={{ mt: 1 }}>
              <Link href={`https://${user.socialMediaAccounts.facebook}`}>
                {user.socialMediaAccounts.facebook}
              </Link>
            </Typography>
          ) : (
            <Typography sx={{ mt: 1.5 }} variant="body2" color="GrayText">
              No Facebook account linked
            </Typography>
          )}
        </ContentLayout>
        <ContentLayout title="Twitter" icon={<TwitterIcon color="disabled" />}>
          {user.socialMediaAccounts.twitter !== "" ? (
            <Typography>{user.socialMediaAccounts.twitter}</Typography>
          ) : (
            <Typography sx={{ mt: 1.5 }} variant="body2" color="GrayText">
              No Twitter account linked
            </Typography>
          )}
        </ContentLayout>
        <ContentLayout
          title="Instagram"
          icon={<InstagramIcon color="disabled" />}
        >
          {user.socialMediaAccounts.instagram !== "" ? (
            <Typography>{user.socialMediaAccounts.instagram}</Typography>
          ) : (
            <Typography sx={{ mt: 1.5 }} variant="body2" color="GrayText">
              No Twitter account linked
            </Typography>
          )}
        </ContentLayout>
      </Paper>
      <Paper sx={{ p: 4, mb: 1 }} variant="outlined">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PersonOutlineOutlinedIcon />
          <Typography variant="h6">User information</Typography>
        </Stack>
        <ContentLayout title="Username">
          {user.username !== "" ? (
            <Typography>{user.username}</Typography>
          ) : (
            <Typography color="GrayText">No username</Typography>
          )}
        </ContentLayout>
        <ContentLayout title="First name">
          {user.firstName !== "" ? (
            <Typography>{user.firstName}</Typography>
          ) : (
            <Typography color="GrayText">No first name</Typography>
          )}
        </ContentLayout>
        <ContentLayout title="Last name">
          {user.lastName !== "" ? (
            <Typography>{user.lastName}</Typography>
          ) : (
            <Typography color="GrayText">No last name</Typography>
          )}
        </ContentLayout>
        <ContentLayout title="Email">
          {user.mail !== "" ? (
            <Typography>{user.email}</Typography>
          ) : (
            <Typography color="GrayText">No Email</Typography>
          )}
        </ContentLayout>
        <ContentLayout title="Contact number">
          {user.contactNumber !== "" ? (
            <Typography>{user.contactNumber}</Typography>
          ) : (
            <Typography color="GrayText">No contact number given</Typography>
          )}
        </ContentLayout>
        <ContentLayout title="About">
          {user.about !== "" ? (
            <Typography>{user.about}</Typography>
          ) : (
            <Typography color="GrayText">No details about the user</Typography>
          )}
        </ContentLayout>
      </Paper>
    </div>
  );
}

function DateTime(props) {
  const updatedAt = new Date(props.updatedAt);
  const createdAt = new Date(props.createdAt);
  const elapsedTime = computeElapsedTime(updatedAt);
  const dateString = createdAt.toDateString();
  const timeString = ampmTimeFormat(createdAt);

  return (
    <Box>
      <Typography variant="body2">
        <span style={{ fontWeight: "bold" }}>Created</span> {dateString}{" "}
        {timeString}
      </Typography>
      <Typography variant="body2">
        <span style={{ fontWeight: "bold" }}>Last update</span> {elapsedTime}
      </Typography>
    </Box>
  );
}

function VerifyButton({ userId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    const updateUser = await fetch("/api/user/verify", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    const data = await updateUser.json();

    if (updateUser.status === 200) {
      router.push("/users/unverified");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Verify user</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will allow the user to use the essential features of the
            applicaiton. Please do make sure that the user is not a fraud.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Button
        startIcon={<VerifiedUserOutlinedIcon />}
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        Verify
      </Button>
    </div>
  );
}

function Chips({ status, type }) {
  return (
    <Stack sx={{ mt: 0.5 }} direction="row" alignItems="center" spacing={1}>
      <Chip size="small" label={status} color="error" />
      <Chip size="small" label={type} color="info" />
    </Stack>
  );
}

function HeadWithBackButton() {
  const router = useRouter();
  return (
    <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1.5}>
      <IconButton
        onClick={() => {
          router.push("/users/unverified");
        }}
      >
        <ArrowBackOutlinedIcon />
      </IconButton>
      <Head title="Unverified users" />
    </Stack>
  );
}

function Main({ data }) {
  return (
    <Box>
      <HeadWithBackButton />
      <DateTime createdAt={data.createdAt} updatedAt={data.updatedAt} />
      <Chips status={data.status} type={data.type} />
      <Box sx={{ my: 3 }}>
        <VerifyButton userId={data._id} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ProfilePhoto photo={data.photo} />
          <DisplayValidPhoto photo={data.validPhoto} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Content user={data} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Page({ data }) {
  const router = useRouter();

  useEffect(() => {
    if (data.status === "verified") {
      router.push(`/profile/${data._id}`);
    }
  }, [router, data._id, data.status]);

  if (data.status === "unverified") {
    return <Main data={data} />;
  }
  return <CircularProgress />;
}

export async function getServerSideProps({ params }) {
  const { userId } = params;
  const url = process.env.API_URL || "http://localhost:3000";

  const data = await fetch(`${url}/api/user/${userId}`);
  const result = await data.json();

  return {
    props: { data: result.user },
  };
}
