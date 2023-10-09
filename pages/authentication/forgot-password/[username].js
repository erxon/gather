import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import { fetcher } from "@/lib/hooks";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import PersonIcon from "@mui/icons-material/Person";
import _ from "lodash";
import { useState } from "react";

export default function Page({ data }) {
  const [email, setEmail] = useState();
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    if (email === "") return;
    if (email !== data.email) {
      console.log("email did not matched");
      return;
    }
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data._id, to: data.email }),
    });

    if (response.status === 200) {
      setEmailSent(true);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, maxWidth: 300 }}>
        <Stack sx={{ mb: 2 }} direction="row" spacing={1} alignItems="center">
          <Avatar>
            {_.isEmpty(data.photo) ? (
              <PersonIcon />
            ) : (
              <ProfilePhotoAvatar publicId={data.photo} />
            )}
          </Avatar>
          <Box>
            <Typography variant="body2">
              {data.firstName} {data.lastName}
            </Typography>
          </Box>
        </Stack>
        {emailSent ? (
          <Typography>Check your email {data.email} for password reset link</Typography>
        ) : (
          <Box>
            <TextField
              sx={{ mb: 1 }}
              value={email}
              onChange={handleChange}
              fullWidth
              label="Please type your email here"
            />
            <Button onClick={handleSubmit} size="small">
              Send link
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  const { username } = params;
  const url = process.env.API_URL || "http://localhost:3000";
  const response = await fetch(`${url}/api/user/username/${username}`);

  const data = await response.json();

  return {
    props: {
      data: data,
    },
  };
}
