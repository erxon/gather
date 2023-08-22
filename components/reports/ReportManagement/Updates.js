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

function Update({ content, currentUserId, setUpdates }) {
  const { data, error, isLoading } = useSWR(
    `/api/user/${content.user}`,
    fetcher
  );
  const [buttonState, setButtonState] = useState("");

  if (error)
    return <Typography>Something went wrong fetching the user.</Typography>;
  if (isLoading) return <CircularProgress />;

  // const chosenDate = new Date('2023-08-23')
  // const updateCreated = new Date(content.createdAt)
  // const isEqual = chosenDate.toDateString() === updateCreated.toDateString()
  // console.log(isEqual)

  const handleDelete = async (id) => {
    setButtonState("loading");
    const response = await fetch(`/api/reports/management/updates/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);

    setUpdates();
    setButtonState("");
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <ProfilePhoto publicId={data.user.photo} />
            </Avatar>
          }
          title={`${data.user.firstName} ${data.user.lastName}`}
          subheader={`${data.user.username}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {content.text}
          </Typography>
        </CardContent>
        <CardActions>
          {data.user._id === currentUserId &&
            (buttonState === "loading" ? (
              <CircularProgress />
            ) : (
              <IconButton
                onClick={() => {
                  handleDelete(content._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ))}
        </CardActions>
      </Card>
    </Box>
  );
}

function DisplayUpdates({ updates, currentUserId, setUpdates }) {
  return (
    <Box>
      {updates.reverse().map((update) => {
        return (
          <Update
            content={update}
            currentUserId={currentUserId}
            setUpdates={setUpdates}
          />
        );
      })}
    </Box>
  );
}

function AddUpdateForm({
  reportId,
  user,
  show,
  isToShow,
  updates,
  setUpdates,
}) {
  const [update, setUpdate] = useState({
    user: user._id,
    username: user.username,
    reportId: reportId,
    text: "",
    image: "",
    video: "",
  });

  const handleChange = (event) => {
    setUpdate({ ...update, text: event.target.value });
  };

  const handleUpdatePost = async () => {
    const response = await fetch("/api/reports/management/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: update.reportId,
        text: update.text,
        image: update.image,
        video: update.video,
      }),
    });
    console.log(response);

    setUpdates();
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

function Main({ user, reportId }) {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/reports/management/updates/updates-by-report/${reportId}`,
    fetcher
  );
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [date, setDate] = useState(new Date());
  const time = ampmTimeFormat(date);

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <SectionHeader icon={<FeedOutlinedIcon />} title="Updates" />
      <Typography sx={{ mt: 1 }}>
        {date.toDateString()} {time}
      </Typography>
      <AddUpdateForm
        user={user}
        reportId={reportId}
        updates={data}
        setUpdates={mutate}
        show={showUpdateForm}
        isToShow={setShowUpdateForm}
      />
      <Box sx={{ mt: 2 }}>
        <AddUpdateButton setShowUpdateForm={setShowUpdateForm} />
      </Box>
      <Box sx={{ mt: 2, mb: 4 }}>
        {data.length > 0 ? (
          <DisplayUpdates
            setUpdates={mutate}
            updates={data}
            currentUserId={user._id}
          />
        ) : (
          <Typography color="GrayText" variant="body2">
            There were no updates yet
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function Updates({ reportId }) {
  const [user, { loading }] = useUser();

  if (loading) return <CircularProgress />;

  return <Main user={user} reportId={reportId} />;
}
