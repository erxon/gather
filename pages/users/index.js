import { useEffect } from "react";
import { useUser, fetcher } from "../../lib/hooks";
import { CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";
import Head from "@/components/Head";
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import UserList from "@/components/users/UserList";
import UserStatus from "@/components/authorization/UserStatus";
import StackRowLayout from "@/utils/StackRowLayout";
import SearchBarUsers from "@/components/searchBars/SearchBarUsers";

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
          <Stack direction="row" spacing={2}>
            <Head title="Users" icon={<PeopleOutlineOutlinedIcon />} />
            <SearchBarUsers />
          </Stack>
          <UserList currentUser={user} />
        </UserStatus>
      </>
    );
}
