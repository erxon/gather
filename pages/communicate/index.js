import { useUser } from "@/lib/hooks";
import { CircularProgress } from "@mui/material";
import ChatMain from "@/components/ChatMain";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
export default function Communicate() {
  const [user, { loading}] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading]);

  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <>
      {user && <ChatMain user={user.username}/>}
    </>
  );
}
