import { useState } from "react";
import { useUser } from "@/lib/hooks";
import Router from "next/router";


export default function Admin() {
  const [user, { mutate }] = useUser();

  const [values, setValues] = useState({
    username: "",
    password: "",
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
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
      }),
    });

    const data = await res.json();
    
    if (data) {
        mutate(data)
      Router.push("/admin/users");
    }
  };
  const handleLogout = async () => {
    await fetch('/api/logout')
    mutate({user: null})
    
  }

  return (
    <>
      <div>
        {user ? (
          <div>
            <a role="button" onClick={handleLogout}>Logout current account</a>
          </div>
        ) : (
          <div>
            <h1>Admin</h1>
            <input
              type="text"
              placeholder="username"
              name="username"
              onChange={handleChange}
              required
            />
            <br />
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
              required
            />
            <br />
            <button onClick={handleSubmit}>Login</button>
          </div>
        )}
      </div>
    </>
  );
}
