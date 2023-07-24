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
          }}
          variant="outlined"
        >
          <CardMedia sx={{ p: 3 }}>
            {publicId ? (
              <Avatar sx={{ width: 56, height: 56 }}>
                <ProfilePhoto publicId={publicId} />
              </Avatar>
            ) : (
              <Avatar
                sx={{ width: 56, height: 56 }}
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
          <Box sx={{ width: "100%" }}>
            <CardContent sx={{ height: 60 }}>
              <Typography sx={{ fontWeight: "bold" }} variant="body1">
                {firstName} {lastName}
              </Typography>
              <StackRowLayout spacing={1}>
                <Typography
                  variant="body2"
                  color="GrayText"
                  sx={{ fontWeight: "bold" }}
                >
                  {username}
                </Typography>
                <Chip color="info" label={type} size="small" />
                <Chip color="success" label={status} size="small" />
              </StackRowLayout>
              <Typography variant="subtitle2">{email}</Typography>
            </CardContent>
            <CardActions sx={{ width: "100%" }}>
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
