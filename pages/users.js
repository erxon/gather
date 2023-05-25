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
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GroupIcon from "@mui/icons-material/Group";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import { addToContactRequest } from "@/lib/api-lib/api-notifications";
import Image from "next/image";

//display all users
//display add contact if user is authenticated
function User(props) {
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
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            sx={{ mt: 3 }}
            color="primary"
            size="small"
            icon={<VerifiedUserIcon />}
            label={`${type}`}
          />
          <CardMedia sx={{ p: 3 }}>
            {publicId ? (
              <ProfilePhoto publicId={publicId} />
            ) : (
              <Image
                width="120"
                height="120"
                alt="placeholder"
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
          <Box>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">{username}</Typography>
              <Typography variant="subtitle2">{email}</Typography>
            </CardContent>
          </Box>
          <Box sx={{ width: "100%" }}>
            <CardActions>
              {buttonState === "noCurrentAction" && (
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleClick("noCurrentAction")}
                >
                  Add Contact
                </Button>
              )}
              {buttonState === "disable" && (
                <Button fullWidth variant="outlined" size="small" disabled>
                  Requested
                </Button>
              )}
              {buttonState === "requestAccepted" && (
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleClick("requestAccepted")}
                >
                  Remove contact
                </Button>
              )}
            </CardActions>
            <CardActions>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                href={`profile/${props.id}`}
              >
                View Profile
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
  const [currentUser, { loading }] = useUser();

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (currentUser && !loading) {
      setContacts(currentUser.contacts);
    }
  }, [currentUser, contacts, loading]);

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  console.log(contacts);

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

  return (
    <>
      <div>
        <Grid container spacing={1}>
          {!!users?.length &&
            currentUser &&
            users.map((user) => {
              if (user._id !== currentUser._id) {
                return (
                  <Grid item xs={12} md={3} sm={4} key={user._id}>
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
  return (
    <>
      <div>
        <Typography sx={{ mb: 2 }} variant="h5">
          Users
        </Typography>

        <UserList />
        {/* <ContactList /> */}
      </div>
    </>
  );
}
