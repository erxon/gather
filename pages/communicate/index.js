import { useUser } from "@/lib/hooks";
import { CircularProgress } from "@mui/material";
import ChatMain from "@/components/ChatMain";
import Router from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
export default function Communicate() {
  const [user, { loading }] = useUser();

  useEffect(() => {
    if (!loading && !user) {
      Router.push("/login");
    }
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <ChatMain user={user.username}/>
    </>
  );
}
