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
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GroupIcon from "@mui/icons-material/Group";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import { addToContactRequest } from "@/lib/api-lib/api-notifications";

//display all users
//display add contact if user is authenticated
function User(props) {
  //Check if the user is already in the contact
  //if the user is already in the contacts, display Remove from Contacts button
  //if the user is not yet in the contacts, display Add as a contact button
  //
  // let id = props.id;
  // let contacts = [...props.contacts];

  const username = props.username;
  const email = props.email;
  const publicId = props.publicId;
  const type = props.type;

  // const [added, isAdded] = useState(props.contacts.includes(props.id));
  const [buttonState, setButtonState] = useState(
    props.contacts.includes(props.id) ? "requestAccepted" : "noCurrentAction"
  );

  const handleClick = (previousState) => {
    if (previousState === "noCurrentAction") {
      props.onAdd(props.id);
      setButtonState("disable");
    } else if (previousState === "requestAccepted") {
      setButtonState("noCurrentAction");
      props.onDelete(props.id);
    }

    // isAdded(!added);
    // if (!added) {
    //   props.onAdd(props.id);
    // } else {
    //   props.onDelete(props.id);
    // }
  };

  return (
    <>
      <Box>
        <Card
          style={{ maxWidth: "200px", textAlign: "center" }}
          variant="outlined"
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
              <img
                style={{ width: "120px", height: "120px" }}
                src="/assets/placeholder.png"
              />
            )}
          </CardMedia>
          <CardContent>
            <Typography variant="subtitle1">{username}</Typography>
            <Typography variant="subtitle2">{email}</Typography>
          </CardContent>
          <CardActions>
            {/* <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleClick}
              >
                {added ? "Remove contact" : "Add"}
              </Button> */}
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
        </Card>
      </Box>
    </>
  );
}
function UserList() {
  const { data: { users } = {} } = useSWR("/api/users", fetcher);
  const [user, { mutate }] = useUser();

  const [currentUser, setCurrentUser] = useState({});
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    if (user) {
      setContacts([...user.contacts]);
      setCurrentUser((prev) => {
        return { ...prev, ...user };
      });
    }
  }, [user]);
  console.log(contacts);

  // if(currentUser) {
  //     let userContacts = currentUser.contacts;
  //     setContacts((current) => [...current, ...userContacts])
  // }
  const handleAddContact = async (contact) => {
    setContacts((prev) => {return [...prev, contact]});
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
      console.log(contacts);
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
        <Grid container spacing={3}>
          {!!users?.length &&
            users.map((user) => {
              if (user.username !== currentUser.username) {
                return (
                  <Grid item xs={12} md={3} sm={4}>
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <GroupIcon />
          <Typography variant="h6">Users</Typography>
        </Stack>

        <UserList />
        {/* <ContactList /> */}
      </div>
    </>
  );
}
