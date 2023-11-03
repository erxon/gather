//Components
import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Grid,
  Paper,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Modal,
  CardActions,
  IconButton,
} from "@mui/material";
//Components
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import ContactList from "@/components/ContactList";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";

//MUI Icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { getUser } from "@/lib/api-lib/api-users";
import { useState } from "react";
import Link from "next/link";
import ContentLayout from "@/utils/layout/ContentLayout";

function DisplayLink({ open, handleClose, url }) {
  console.log(url);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box>
        <iframe src={url} title="Account"></iframe>
      </Box>
    </Modal>
  );
}

function Contact(props) {
  return (
    <>
      <Card sx={{ mb: 3 }} variant="outlined">
        <Stack sx={{ px: 2 }} direction="row" spacing={1} alignItems="center">
          <CardMedia>
            {props.photo !== "" ? (
              <Avatar>
                <ProfilePhotoAvatar publicId={props.photo} />
              </Avatar>
            ) : (
              <Avatar src="/assets/placeholder.png" />
            )}
          </CardMedia>
          <CardContent sx={{ flex: "1" }}>
            <Typography variant="subtitle2">{props.username}</Typography>
            <Chip size="small" label={props.type} />
          </CardContent>
        </Stack>
      </Card>
    </>
  );
}

export default function ProfileIndex({ data }) {
  const user = data;
  const [openFrame, setOpenFrame] = useState({
    open: false,
    url: "",
  });

  return (
    <ContentLayout>
      <DisplayLink
        open={openFrame.open}
        url={openFrame.url}
        handleClose={() => {
          setOpenFrame({ open: false });
        }}
      />
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Profile
        </Typography>
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
                          No display name
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
                    {user.contactNumber ? (
                      <Typography variant="body1">
                        {user.contactNumber}
                      </Typography>
                    ) : (
                      <Typography color="GrayText" variant="body1">
                        No contact number given
                      </Typography>
                    )}
                  </Stack>
                  <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
                    <FacebookIcon />
                    {user.socialMediaAccounts.facebook ? (
                      <Typography variant="body1">
                        <Link
                          href={`https://${user.socialMediaAccounts.facebook}`}
                        >
                          {user.socialMediaAccounts.facebook}
                        </Link>
                      </Typography>
                    ) : (
                      <Typography color="GrayText" variant="body1">
                        No account linked
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
                        No account linked
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Contacts</Typography>
                {user.contacts.length > 0 ? (
                  user.contacts.map((contact) => {
                    return (
                      <Contact
                        key={contact._id}
                        photo={contact.photo}
                        username={contact.username}
                        type={contact.type}
                      />
                    );
                  })
                ) : (
                  <Typography color="GrayText">No contacts yet</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </ContentLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { uid } = params;

  const data = await getUser(uid);

  return {
    props: { data: data.user },
  };
}
