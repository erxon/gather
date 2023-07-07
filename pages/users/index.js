import { useEffect } from "react";
import { useUser, fetcher } from "../../lib/hooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Head from "@/components/Head";
import PeopleIcon from "@mui/icons-material/People";
import UserList from "@/components/users/UserList";
import UserStatus from "@/components/authorization/UserStatus";

export default function Users() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user)
    return (
      <>
        <UserStatus>
          <Head title="Users" icon={<PeopleIcon />} />
          <UserList currentUser={user} />
        </UserStatus>
      </>
    );
}
