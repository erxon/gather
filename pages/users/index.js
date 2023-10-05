import { useEffect } from "react";
import { useUser, fetcher } from "../../lib/hooks";
import { Box, CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";
import Head from "@/components/Head";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import UserList from "@/components/users/UserList";
import UserStatus from "@/components/authorization/UserStatus";
import StackRowLayout from "@/utils/StackRowLayout";

export default function Users() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <CircularProgress />;
  if (user)
    return (
      <>
        <UserStatus>
          <Head title="Users" icon={<PeopleOutlineOutlinedIcon />} />
          <UserList currentUser={user} />
        </UserStatus>
      </>
    );
}
