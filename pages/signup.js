import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Signup() {
  const [user, { mutate }] = useUser();
  console.log(user);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
      email: e.currentTarget.email.value,
    };

    if (body.password !== e.currentTarget.rpassword.value) {
      setErrorMsg(`The passwords don't match`);
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
  }

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) {
      Router.push("/");
    }
  }, [user]);

  return (
    <>
      <div className="w-25 mt-5">
        <h2>Signup</h2>
        <form onSubmit={onSubmit}>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control id="username" type="text" name="username" />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control id="email" type="email" name="email" />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control id="password" type="password" name="password" />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="rpassword">Repeat Password</Form.Label>
            <Form.Control id="rpassword" type="password" name="rpassword" />
          </Form.Group>
          <Form.Group className="mt-2">
            <Button variant="primary" type="submit">
              Signup
            </Button>
          </Form.Group>
          <Link href="/login">Login</Link>
        </form>
      </div>
    </>
  );
}
