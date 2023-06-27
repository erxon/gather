import { useState, useEffect } from "react";
import { useUser, fetcher } from "../lib/hooks";
import useSWR from "swr";
import {
  Typography,
  Card,
  Button,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import { addToContactRequest } from "@/lib/api-lib/api-notifications";
import { useRouter } from "next/router";
import Head from "@/components/Head";
import PeopleIcon from "@mui/icons-material/People";
import StackRowLayout from "@/utils/StackRowLayout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";

//display all users
//display add contact if user is authenticated

function User(props) {
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

function UserList() {
  const {
    data: { users } = {},
    error,
    isLoading,
  } = useSWR("/api/users", fetcher);

  const [filterByType, setFilterByType] = useState("all");
  const [currentUser, { loading }] = useUser();

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (currentUser && !loading) {
      setContacts(currentUser.contacts);
    }
  }, [currentUser, contacts, loading, users]);

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  const handleAddContact = async (contact) => {
    setContacts((prev) => {
      return [...prev, contact];
    });
    await addToContactRequest({
      message: `${currentUser.username} wants to add you as a contact`,
      userId: contact,
      from: currentUser._id,
      photo: currentUser.photo,
    });
  };
  const handleDeleteContact = async (contact) => {
    let array = contacts;
    let index = contacts.indexOf(contact);
    if (index !== -1) {
      array.splice(index, 1);
      setContacts(array);
    }

    const body = {
      contactId: contact,
    };

    const res = await fetch("/api/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(res);
  };
  const handleSelect = (event) => {
    setFilterByType(event.target.value);
  };

  return (
    <>
      <div>
        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterByType}
              label="Type"
              onChange={handleSelect}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="citizen">Citizens</MenuItem>
              <MenuItem value="authority">Authorities</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {!!users?.length &&
            currentUser &&
            users
              .filter((user) => {
                if (filterByType === "all") {
                  return user;
                }
                return user.type === filterByType;
              })
              .map((user) => {
                if (user._id !== currentUser._id) {
                  return (
                    <Grid item xs={12} md={4} sm={4} key={user._id}>
                      <User
                        key={user._id}
                        id={user._id}
                        publicId={user.photo && user.photo}
                        username={user.username}
                        type={user.type}
                        email={user.email}
                        contacts={contacts}
                        onAdd={handleAddContact}
                        onDelete={handleDeleteContact}
                      />
                    </Grid>
                  );
                }
              })}
        </Grid>
      </div>
    </>
  );
}

export default function Users() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user)
    return (
      <>
        <Head title="Users" icon={<PeopleIcon />} />
        <UserList />
      </>
    );
}
