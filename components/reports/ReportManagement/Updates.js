import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Collapse,
  TextField,
  Avatar,
  IconButton,
  Tooltip,
  Link,
  Chip,
  CircularProgress,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import SectionHeader from "@/utils/SectionHeader";
import useSWR from "swr";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import { useState } from "react";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";

import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";

import ProfilePhoto from "@/components/photo/ProfilePhoto";
import StackRowLayout from "@/utils/StackRowLayout";
import { fetcher, useUser } from "@/lib/hooks";

function Update({ content, currentUserId }) {
  const { data, error, isLoading } = useSWR(
    `/api/user/${content.userId}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching the user.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{mb: 1}}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <ProfilePhoto publicId={data.user.photo} />
            </Avatar>
          }
          title={`${data.user.firstName} ${data.user.lastName}`}
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {content.text}
          </Typography>
        </CardContent>
        <CardActions>
          {data.user._id === currentUserId && (
            <IconButton>
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}

function DisplayUpdates({ updates, currentUserId }) {
  return (
    <Box>
      {updates.map((update) => {
        return <Update content={update} currentUserId={currentUserId} />;
      })}
    </Box>
  );
}

function AddUpdateForm({ user, show, isToShow, updates, setUpdates }) {
  const [update, setUpdate] = useState({
    userId: user._id,
    username: user.username,
    text: "",
    image: {},
    video: {},
  });
  const handleChange = (event) => {
    setUpdate({ ...update, text: event.target.value });
  };

  const handleUpdatePost = () => {
    setUpdates([...updates, update]);
  };

  return (
    <Collapse in={show}>
      <Paper sx={{ p: 3 }} variant="outlined">
        <Stack
          justifyContent="center"
          alignItems="flex-start"
          direction="row"
          spacing={1}
        >
          {user.photo ? (
            <Avatar sx={{ width: 56, height: 56 }}>
              <ProfilePhoto publicId={user.photo} />
            </Avatar>
          ) : (
            <Avatar src="/assets/placeholder.png" />
          )}
          <Box sx={{ pl: 3, pr: 1, width: "100%" }}>
            <TextField
              multiline
              fullWidth
              variant="standard"
              placeholder="Enter text here"
              value={update.text}
              onChange={handleChange}
            />
            <Chip
              color="secondary"
              sx={{ mt: 0.5 }}
              label="This person is already found"
              onClick={() => {
                setUpdate({ ...update, text: "This person is already found" });
              }}
            />
            <Stack sx={{ mt: 2 }} direction="row" spacing={1}>
              <Button
                onClick={handleUpdatePost}
                size="small"
                variant="contained"
                disableElevation
              >
                Post
              </Button>
              <Button size="small" onClick={() => isToShow(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
          <Box>
            <Tooltip title="attach image or video">
              <IconButton color="primary">
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Paper>
    </Collapse>
  );
}

function AddUpdateButton({ setShowUpdateForm }) {
  const handleClick = () => {
    setShowUpdateForm(true);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        size="small"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add
      </Button>
    </div>
  );
}

export default function Updates() {
  const [user, { loading }] = useUser();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [date, setDate] = useState(new Date());
  const time = ampmTimeFormat(date);

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <SectionHeader icon={<FeedOutlinedIcon />} title="Updates" />
      <Typography sx={{ mt: 1 }}>
        {date.toDateString()} {time}
      </Typography>
      <Box sx={{ mt: 2, mb: 4 }}>
        {updates.length > 0 ? (
          <DisplayUpdates updates={updates} currentUserId={user._id} />
        ) : (
          <Typography color="GrayText" variant="body2">
            There were no updates yet
          </Typography>
        )}
      </Box>
      <AddUpdateForm
        user={user}
        updates={updates}
        setUpdates={setUpdates}
        show={showUpdateForm}
        isToShow={setShowUpdateForm}
      />
      <Box sx={{ mt: 2 }}>
        <AddUpdateButton setShowUpdateForm={setShowUpdateForm} />
      </Box>
    </Paper>
  );
}
