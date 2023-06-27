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
  Avatar
} from "@mui/material";
import ProfilePhoto from "@/components/photo/ProfilePhoto";

import StackRowLayout from "@/utils/StackRowLayout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";

import { useState } from "react";

export default function User(props) {
  const router = useRouter();
  const { username, email, publicId, type } = props;

  const button = props.contacts.includes(props.id)
    ? "requestAccepted"
    : "noCurrentAction";

  const [buttonState, setButtonState] = useState(button);
  console.log(buttonState);

  const handleClick = (previousState) => {
    if (previousState === "noCurrentAction") {
      props.onAdd(props.id);
      setButtonState("disable");
    } else if (previousState === "requestAccepted") {
      props.onDelete(props.id);
      setButtonState("Add contact");
    }
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
                <Chip label={type} />
              </StackRowLayout>
              <Typography variant="subtitle2">{email}</Typography>
            </CardContent>
            <CardActions>
              {buttonState === "noCurrentAction" && (
                <Tooltip title="Add to contacts">
                  <IconButton
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => handleClick("noCurrentAction")}
                  >
                    <PersonAddIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              {buttonState === "disable" && (
                <Button fullWidth variant="contained" size="small" disabled>
                  Requested
                </Button>
              )}
              {buttonState === "requestAccepted" && (
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => handleClick("requestAccepted")}
                >
                  Remove contact
                </Button>
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
