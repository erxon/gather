// import { useUser } from "@/lib/hooks"
// import Link from "next/link";

// export default function Users({data}){
//     const [user, {mutate}] = useUser();
//     return <>
//         {
//             user ? (
//                 user.type === 'admin' ? (<div>
//                     Users will be displayed here
//                     {data.users.map((userObj) => {
//                         return {JSON.stringify(userObj, null, 2)}
//                     })}
                    
//                     </div>) :
//                 (<div>
//                     <p>You're not an administrator. 
//                         If you are an admin, please logout this current account
//                         and <span><Link href="/admin">login as an admin</Link></span> instead
//                         </p>
                    
//                 </div>)
//             ) : (<div>Loading...</div>)
//         }
        
//     </>
// }

// export async function getServerSideProps(){
//     const res = await fetch('http://localhost:3000/api/users')

//     const data = await res.json();

//     return {
//         props: {data}
//     }
// }

