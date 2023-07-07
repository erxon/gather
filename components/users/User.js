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
  const { username, email, publicId, type, status } = props;

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
            alignItems: "center",
          }}
          variant="outlined"
        >
          <CardMedia sx={{ p: 3 }}>
            {publicId ? (
              <ProfilePhoto publicId={publicId} />
            ) : (
              <Avatar
                sx={{ width: 56, height: 56 }}
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
          <Box>
            <CardContent>
              <StackRowLayout spacing={1}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {username}
                </Typography>
                <Chip label={type} color="secondary" size="small" />
                <Chip label={status} color="success" size="small" />
              </StackRowLayout>
              <Typography variant="subtitle2">{email}</Typography>
            </CardContent>
            <CardActions>
              {console.log(props.contactRequests)}
              {button.inRequests ? (
                <Button fullWidth variant="contained" size="small" disabled>
                  Requested
                </Button>
              ) : button.inContacts ? (
                <IconButton size="small" onClick={handleRemove}>
                  <PersonRemoveIcon />
                </IconButton>
              ) : (
                <Tooltip title="Add to contacts">
                  <IconButton
                    fullWidth
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
