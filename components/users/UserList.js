import {
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import User from "./User";

import { addToContactRequest } from "@/lib/api-lib/api-notifications";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

export default function UserList() {
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
