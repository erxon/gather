import {
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import User from "./User";

import { addToContactRequest } from "@/lib/api-lib/api-notifications";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

export default function UserList({currentUser}) {
  const {
    data: { users } = {},
    error,
    isLoading,
  } = useSWR("/api/users", fetcher, {refreshInterval: 1000});
  
  const [filterByType, setFilterByType] = useState("all");
  const [contacts, setContacts] = useState(currentUser.contacts);
  const [contactRequests, setContactRequests] = useState(currentUser.contactRequests);

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  const verifiedUsers = users.filter((user) => {
    return user.status === "verified"
  })

  const handleAddContact = async (contact) => {
    contactRequests.push(contact)
    setContactRequests(contactRequests);
    //save requests to database
    await fetch("/api/user", {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({contactRequests: contactRequests})
    })
    //send notification
    await addToContactRequest({
      message: `${currentUser.username} wants to add you as a contact`,
      userId: contact,
      from: currentUser._id,
      photo: currentUser.photo,
    });
  };

  const handleDeleteContact = async (contact) => {
    setContacts(
      contacts.filter((contact) => {
        return contact !== contact;
      })
    );

    await fetch("/api/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId: contact }),
    });
  };
  
  const handleSelect = (event) => {
    setFilterByType(event.target.value);
  };

  return (
    <>
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
          {!!verifiedUsers?.length &&
            currentUser &&
            verifiedUsers
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
                        firstName={user.firstName}
                        lastName={user.lastName}
                        contacts={contacts}
                        contactRequests={contactRequests}
                        status={user.status}
                        onAdd={handleAddContact}
                        onDelete={handleDeleteContact}
                      />
                    </Grid>
                  );
                }
              })}
        </Grid>
    </>
  );
}
