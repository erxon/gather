import { useUser } from "@/lib/hooks";
import { useState } from "react";
import Router from "next/router";

export default function AuthorityUpload() {
  const [user, { mutate }] = useUser();

  let userObj = {
    username: "",
    account: ""
  };
  if(user){
    userObj.username = user.username
    userObj.account = user._id
  }

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    lastSeen: "",
    age: "",
    gender: "",
    status: "active"
  });

  

  const handleChange = (event) => {
    const { value, name } = event.target;

    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async () => {
    const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...values,
            ...userObj
        })
    })

    const data = await res.json()
    const reportId = data.data._id;

    if (data.data){
        Router.push(`/reports/edit/${reportId}`)
    }
    

    setValues({
      firstName: "",
      lastName: "",
      lastSeen: "",
      age: "",
      gender: "",
    });
  };

  return (
    <>
      <div>
        <input
          id="firstName"
          name="firstName"
          placeholder="First name"
          type="text"
          value={values.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          id="lastName"
          name="lastName"
          placeholder="Last name"
          type="text"
          value={values.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          id="lastSeen"
          name="lastSeen"
          placeholder="Last seen"
          type="text"
          value={values.lastSeen}
          onChange={handleChange}
          required
        />
        <br />
        <input
          id="age"
          name="age"
          placeholder="Age"
          type="text"
          value={values.age}
          onChange={handleChange}
          required
        />
        <br />
        <input
          id="gender"
          name="gender"
          placeholder="Gender"
          type="text"
          value={values.gender}
          onChange={handleChange}
          required
        />
        <br />
        <button onClick={handleSubmit} className="mt-3" variant="primary">
          Upload
        </button>
      </div>
    </>
  );
}
