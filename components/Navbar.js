import { useUser } from "@/lib/hooks"
import Link from "next/link"
export default function Navbar() {
    const [user, {mutate}] = useUser()
    const handleLogout = async () => {
        await fetch('/api/logout')
        mutate({user: null});
    }
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link href="/" >Home</Link>
                    </li>
                    {
                        user ? (
                        <>
                            <li>
                               <Link href="/profile">Profile</Link> 
                            </li>
                            <li>
                               <a role="button" onClick={handleLogout}>Logout</a> 
                            </li>
                        </>
                        ) : (
                        <>
                            <li>
                                <Link href="/login" legacyBehavior>Login</Link>
                            </li>
                            <li>
                                <Link href="/signup" legacyBehavior>Signup</Link>
                            </li>
                        </>
                        )
                    }
                </ul>
            </nav>
        </>
    )
}