import Link from "next/link"

export default function Signup(){
    
    return (
        <>
            <label>Username</label>
            <input name="username" />
            <br />
            <label>Email</label>
            <input name="email" />
            <br />
            <label>Password</label>
            <input name="password" />
            <br />
            <button>Signup</button>
            <Link href="/login">Login</Link>
        </>
    )
}