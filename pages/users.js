import { useState, useEffect } from "react";
import { useUser, fetcher } from "../lib/hooks";
import useSWR from "swr";
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
  const [added, isAdded] = useState(props.contacts.includes(props.id));
  const handleClick = () => {
    isAdded(!added);
    if (!added) {
      props.onAdd(props.id);
    } else {
      props.onDelete(props.id);
    }
  };
  return (
    <>
      <h2>{username}</h2>
      <p>{email}</p>
      <button onClick={handleClick}>
        {added ? "Remove from contacts" : "Add as a contact"}
      </button>
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
      setContacts((current) => [...user.contacts, ...current]);
      setCurrentUser((prev) => {
        return { ...prev, ...user };
      });
    }
  }, [user]);

  // if(currentUser) {
  //     let userContacts = currentUser.contacts;
  //     setContacts((current) => [...current, ...userContacts])
  // }
  const handleAddContact = async (contact) => {
    setContacts((current) => [...current, contact]);
    const body = {
      currentUser: currentUser.username,
      newContact: contact,
    };

    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(res)

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
          id: contact
    }
    const res = await fetch('/api/contacts', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body)
    });
    console.log(res)
    // setContacts((current) => {
    //     current.filter((data) => {return data !== contact})
    // });
  };

  // const handleAddContact = async (id) => {
  //     contacts.push(id);

  //     const body = {
  //         currentUser: currentUser.username,
  //         newContact: id
  //     }
  //     const res = await fetch('/api/contacts', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(body)
  //     });

  //     console.log(res);
  // }
  // const handleDeleteContact = async (id) => {
  //     contacts.pop(contacts.indexOf(id));

  //     const body = {
  //         id: id
  //     }
  //     const res = await fetch('/api/contacts', {
  //         method: 'PUT',
  //         headers: {'Content-Type': 'application/json'},
  //         body: JSON.stringify(body)
  //     });

  //     console.log(res);

  // }
  return (
    <>
      <div>
        {!!users?.length &&
          users.map((user) => {
            if (user.username !== currentUser.username) {
              return (
                <div>
                  {/* <h2>{user.username}</h2>
                            <p>{user.email}</p>
                            {currentUser && (
                                currentUser.username !== user.username && 
                                (!!contacts?.length && contacts.includes(user._id) ? 
                                (<button onClick={() => {handleDeleteContact(user._id)}}>Remove from contacts</button>) :
                                (<button onClick={() => {handleAddContact(user._id)}}>Add as a Contact</button>))
                            )} */}
                  <User
                    key={user._id}
                    id={user._id}
                    username={user.username}
                    email={user.email}
                    contacts={contacts}
                    onAdd={handleAddContact}
                    onDelete={handleDeleteContact}
                  />
                </div>
              );
            }
          })}
      </div>
    </>
  );
}

export default function Users() {
  return (
    <>
      <div>
        <h1>Users</h1>
        <UserList />
        {/* <ContactList /> */}
      </div>
    </>
  );
}
