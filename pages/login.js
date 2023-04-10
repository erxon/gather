import { useState, useEffect } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useUser } from '@/lib/hooks'

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
            <div>
                <form onSubmit={onSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                            name="username"
                            type="text"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                        />
                    </div>
                    <div>
                        <button type="submit">Login</button>
                        <Link href="/signup">Signup</Link>
                    </div>
                </form>
            </div>

        </>
    )
}