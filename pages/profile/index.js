//Components
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  Chip,
  Button,
  Grid,
} from "@mui/material";
//Components
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import ContactList from "@/components/ContactList";

//Hooks
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
//MUI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import NumbersIcon from "@mui/icons-material/Numbers";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import Router from "next/router";

export default function ProfileIndex() {
  const [user, { loading }] = useUser();
  const router = useRouter();
  useEffect(() => {
    fetch("/api/user/checkAuth").then((response) => {
        response.json().then((data) => {
          if (!data.authenticated) {
            return router.push("/login");
          }
        });
      });
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f2f4f4",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginBottom: "16px" }}
        >
          <AccountCircleIcon />
          <Typography variant="h6">Profile</Typography>
        </Stack>
        {user && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ width: "200px" }}>
                <Stack direction="column" alignItems="start" spacing={1}>
                  <ProfilePhoto publicId={user.photo} />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1">{user.username}</Typography>
                    <Chip
                      size="small"
                      color="primary"
                      icon={<VerifiedUserIcon />}
                      label={`${user.type}`}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Box>
              {/*Basic Information */}
              <Box sx={{ mt: 4 }}>
                {/******Overview********/}
                <Box>
                  <Typography variant="h5">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography sx={{ mt: 1 }} variant="body2">
                    {user.about}
                  </Typography>
                </Box>

                {/******Contact Information********/}
                <Stack sx={{ mt: 3 }} direction="row" spacing={1}>
                  <LocalPhoneIcon />
                  <Typography variant="body1">
                    <strong>Contact Me</strong>
                  </Typography>
                </Stack>
                <Divider />
                <Stack sx={{ mt: 2 }} direction="row" spacing={1}>
                  <EmailIcon />
                  <Typography variant="body1">{user.email}</Typography>
                </Stack>
                <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                  <NumbersIcon />
                  <Typography variant="body1">{user.contactNumber}</Typography>
                </Stack>
                <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                  <FacebookIcon />
                  <Typography variant="body1">
                    {user.socialMediaAccounts.facebook
                      ? user.socialMediaAccounts.facebook
                      : "none"}
                  </Typography>
                </Stack>
                <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                  <TwitterIcon />
                  <Typography variant="body1">
                    {user.socialMediaAccounts.twitter
                      ? user.socialMediaAccounts.twitter
                      : "none"}
                  </Typography>
                </Stack>

                {/*******Buttons********/}
                <Box sx={{ mt: 4 }}>
                  <Stack direction="row" spacing={1}>
                    <Button href="/profile/edit" variant="outlined">
                      Edit
                    </Button>
                    <Button variant="text">Delete</Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <ContactList user={user._id} />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
