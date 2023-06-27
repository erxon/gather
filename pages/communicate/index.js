import { useUser } from "@/lib/hooks";
import { CircularProgress } from "@mui/material";
import ChatMain from "@/components/ChatMain";
import { useRouter } from "next/router";
import { useEffect } from "react";
import UserStatus from "@/components/authorization/UserStatus";

export default function Communicate() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <UserStatus>{user && <ChatMain user={user.username} />}</UserStatus>
    </>
  );
}
