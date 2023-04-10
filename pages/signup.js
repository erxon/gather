import Link from "next/link"
import Router from "next/router";
import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";

export default function Signup() {
    const [user, { mutate }] = useUser()
    console.log(user)
    const [errorMsg, setErrorMsg] = useState('')

    async function onSubmit(e) {
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
            email: e.currentTarget.email.value,
        }

        if (body.password !== e.currentTarget.rpassword.value) {
            setErrorMsg(`The passwords don't match`)
            return
        }

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.status === 201) {
            const userObj = await res.json()
            // set user to useSWR state
            mutate(userObj)
        } else {
            setErrorMsg(await res.text())
        }
    }

    useEffect(() => {
        // redirect to home if user is authenticated
        if (user){ Router.push('/')}
    }, [user])

    return (
        <>
            <form onSubmit={onSubmit}>
                <label>Username</label>
                <input type="text" name="username" />
                <br />
                    <label>Email</label>
                    <input type="email" name="email"  />
                <br />
                    <label>Password</label>
                    <input type="password" name="password" />
                <br />
                    <label>Repeat Password</label>
                    <input type="password" name="rpassword" />
                <br />
                <button type="submit">Signup</button>
                <Link href="/login">Login</Link>
            </form>
            
            
        </>
    )
}