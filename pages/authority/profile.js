import { useUser } from "@/lib/hooks";

export default function AuthorityProfile() {
  const [user, { mutate }] = useUser();
  console.log(user);
  return (
    <>
      <h1>Authority profile</h1>
      {user ? <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        
      </div> : <div>Loading...</div>}
    </>
  );
}
