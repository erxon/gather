import { useUser } from "@/lib/hooks";
import { CircularProgress } from "@mui/material";
import ChatMain from "@/components/ChatMain";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Communicate() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <CircularProgress />;
  }

  return <>{user && <ChatMain user={user.username} />}</>;
}
