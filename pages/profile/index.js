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
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
//Components
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import ContactList from "@/components/ContactList";

//Hooks
import { useUser } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//MUI Icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EditIcon from "@mui/icons-material/Edit";
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
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Button
          href="/profile/edit"
          sx={{ mb: 1 }}
          size="small"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        {user && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {user.photo ? (
                      <Avatar sx={{ width: 56, height: 56 }}>
                        <ProfilePhoto publicId={user.photo} />
                      </Avatar>
                    ) : (
                      <Avatar
                        src="/assets/placeholder.png"
                        sx={{ width: 56, height: 56 }}
                      />
                    )}
                    <Box>
                      {user.firstName || user.lastName ? (
                        <Typography variant="body1">
                          {user.firstName} {user.lastName}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "GrayText" }} variant="body1">
                          Edit this profile to add display name
                        </Typography>
                      )}

                      <Typography variant="subtitle2">
                        {user.username}
                      </Typography>
                      <Chip
                        size="small"
                        color="primary"
                        icon={<VerifiedUserIcon />}
                        label={`${user.type}`}
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Box>
              {/*Basic Information */}
              <Box sx={{ mt: 4 }}>
                {/******Overview********/}
                <Paper sx={{ p: 3 }} elevation={2}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">About Me</Typography>
                    <Typography variant="body2">{user.about}</Typography>
                  </Box>

                  {/******Contact Information********/}

                  <Typography variant="h6">Contact Me</Typography>
                  <Divider />
                  <Stack sx={{ mt: 2 }} direction="row" spacing={1}>
                    <EmailIcon />
                    <Typography variant="body1">{user.email}</Typography>
                  </Stack>
                  <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                    <LocalPhoneIcon />
                    <Typography variant="body1">
                      {user.contactNumber ? (
                        <Typography variant="body1">
                          {user.contactNumber}
                        </Typography>
                      ) : (
                        <Typography color="GrayText" variant="body1">
                          Add a contact number
                        </Typography>
                      )}
                    </Typography>
                  </Stack>
                  <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                    <FacebookIcon />

                    {user.socialMediaAccounts.facebook ? (
                      <Typography variant="body1">
                        {user.socialMediaAccounts.facebook}
                      </Typography>
                    ) : (
                      <Typography color="GrayText" variant="body1">
                        Link your account here
                      </Typography>
                    )}
                  </Stack>
                  <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                    <TwitterIcon />
                    {user.socialMediaAccounts.twitter ? (
                      <Typography variant="body1">
                        {user.socialMediaAccounts.facebook}
                      </Typography>
                    ) : (
                      <Typography color="GrayText" variant="body1">
                        Link your account here
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Contacts</Typography>
                <ContactList user={user._id} />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
