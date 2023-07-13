import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import {
  Card,
  CircularProgress,
  Typography,
  Avatar,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Stack,
  Modal,
  Box,
} from "@mui/material";
import ProfilePhotoAvatar from "../photo/ProfilePhotoAvatar";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import StackRowLayout from "@/utils/StackRowLayout";

import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/router";
import { useState } from "react";

function DisplayConfirmation({ open, handleClose, userId }) {
  const router = useRouter();
  const handleConfirmation = async () => {
    const updateUser = await fetch("/api/user/verify", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });

    if (updateUser.status === 200) {
      router.reload()
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography sx={{ fontWeight: "bold" }}>
          Confirm verification
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Are you sure you want to verify this user?
        </Typography>
        <Button
          sx={{ mr: 1 }}
          onClick={handleConfirmation}
          startIcon={<CheckIcon />}
          size="small"
          variant="contained"
        >
          Confirm
        </Button>
        <Button onClick={() => handleClose()} size="small" variant="outlined">
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

function User({ user }) {
  const router = useRouter();
  const timeElapsed = computeElapsedTime(user.createdAt);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div>
      <DisplayConfirmation
        open={openModal}
        handleClose={handleCloseModal}
        userId={user._id}
      />
      <Card sx={{ display: "flex", alignItems: "center", maxWidth: 400, p: 2, mb: 2 }}>
        <CardMedia>
          {user.photo ? (
            <Avatar>
              <ProfilePhotoAvatar publicId={user.photo} />
            </Avatar>
          ) : (
            <Avatar
              sx={{ width: 56, height: 56 }}
              src="/assets/placeholder.png"
            />
          )}
        </CardMedia>
        <CardContent sx={{ width: "100%", ml: 1 }}>
          {user.firstName === "" || user.lastName === "" ? (
            <Typography variant="body1" color="GrayText">
              No Display Name
            </Typography>
          ) : (
            <Typography variant="body1">
              {user.firstName} {user.lastName}
            </Typography>
          )}
          <StackRowLayout spacing={0.5}>
            <Typography color="primary" variant="subtitle2">
              {user.username}
            </Typography>
            <Chip color="secondary" label={user.type} size="small" />
            <Chip color="error" label={user.status} size="small" />
          </StackRowLayout>
          <Typography variant="subtitle2" color="GrayText">
            {timeElapsed}
          </Typography>
        </CardContent>
        <CardActions sx={{ ml: 1 }}>
          <Stack direction="column" spacing={0.5}>
            <Button
              onClick={() => router.push(`/users/unverified/${user._id}`)}
              variant="contained"
              size="small"
            >
              View
            </Button>
            <Button
              onClick={() => setOpenModal(true)}
              startIcon={<CheckIcon />}
              variant="outlined"
              size="small"
            >
              Verify
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </div>
  );
}

export default function UnverifiedUsers() {
  const { data, error, isLoading } = useSWR("/api/users", fetcher);

  if (error)
    return <Typography>Something went wrong fetching users.</Typography>;
  if (isLoading) return <CircularProgress />;

  const unverifiedUsers = data.users.filter((user) => {
    return user.status === "unverified" && user.type === "citizen";
  });

  if (data) {
    return unverifiedUsers.length > 0 ? (
      unverifiedUsers.map((user) => {
        return <User key={user._id} user={user} />;
      })
    ) : (
      <Typography>No unverified users.</Typography>
    );
  }
}
