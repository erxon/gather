import Link from "next/link"

export default function Login(){
    return(
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
            <button>Login</button>
            <Link href="/signup">Signup</Link>
        </>
    )
}