import { useState, useEffect } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useUser } from '@/lib/hooks'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Login() {
    const [user, { mutate }] = useUser()
    const [errorMsg, setErrorMsg] = useState('')

    async function onSubmit(e) {
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        }

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.status === 200) {
            const userObj = await res.json()
            // set user to useSWR state
            mutate(userObj)
        } else {
            setErrorMsg('Incorrect username or password. Try better!')
        }
    }

    useEffect(() => {
        // redirect to home if user is authenticated
        if (user) Router.push('/')
    }, [user])

    return (
        <>
            <div className="w-25 mt-5">
                <h1>Login</h1>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mt-3">
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control
                            name="username"
                            id="username"
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            id="password"
                            name="password"
                            type="password"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Button className="me-3 mb-3" variant="primary" type="submit">Login</Button>
                        
                    </Form.Group>
                    <Form.Text id="passwordHelpBlock" muted>No Account Yet?</Form.Text>{" "}
                    <Link href="/signup">Signup</Link>
                    
                </form>
            </div>

        </>
    )
}