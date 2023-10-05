import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import ProfilePhoto from "@/components/photo/ProfilePhoto";

import StackRowLayout from "@/utils/StackRowLayout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import { useState } from "react";
import ProfilePhotoAvatar from "../photo/ProfilePhotoAvatar";

export default function User(props) {
  const router = useRouter();
  const { firstName, lastName, username, email, publicId, type, status } =
    props;

  const [button, setButton] = useState({
    inRequests: props.contactRequests.includes(props.id),
    inContacts: props.contacts.includes(props.id),
  });

  const handleRequest = () => {
    props.onAdd(props.id);
    setButton({ ...button, inRequests: true });
  };

  const handleRemove = () => {
    props.onDelete(props.id);
    setButton({ ...button, inContacts: false });
  };

  return (
    <>
      <Box>
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row", sm: "column" },
            alignItems: { xs: "center", md: "flex-start", sm: "center" },
            p: 2,
          }}
        >
          <CardMedia>
            {publicId ? (
              <ProfilePhotoAvatar publicId={publicId} />
            ) : (
              <Avatar
                sx={{ width: 42, height: 42 }}
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <CardContent
              sx={{
                textAlign: { xs: "center", md: "start" },
                pl: 2,
                pt: 0,
                mb: 2,
                height: 60,
              }}
            >
              <Typography sx={{ fontWeight: "bold" }} variant="body2">
                {firstName} {lastName}
              </Typography>
              <Typography
                variant="body2"
              >
                {username}
              </Typography>
              <Typography sx={{mb: 0.5}} variant="body2">{email}</Typography>
              <Chip color="info" label={type} size="small" />
              <Chip
                sx={{ ml: 0.5 }}
                color="success"
                label={status}
                size="small"
              />
            </CardContent>
            <CardActions>
              {button.inRequests ? (
                <Button variant="contained" size="small" disabled>
                  Requested
                </Button>
              ) : button.inContacts ? (
                <IconButton size="small" onClick={handleRemove}>
                  <PersonRemoveIcon />
                </IconButton>
              ) : (
                <Tooltip title="Add to contacts">
                  <IconButton
                    variant="contained"
                    size="small"
                    onClick={handleRequest}
                  >
                    <PersonAddIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              <Button
                startIcon={<PersonIcon />}
                variant="outlined"
                sx={{ ml: 1.5 }}
                size="small"
                onClick={() => {
                  router.push(`profile/${props.id}`);
                }}
              >
                Profile
              </Button>
            </CardActions>
          </Box>
        </Card>
      </Box>
    </>
  );
}
