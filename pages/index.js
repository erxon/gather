import { useEffect } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import CheckAuth from "@/utils/checkAuth.util";

export default function Index(){
  const router = useRouter();
  useEffect(() => {
    fetch('/api/user/checkAuth').then((response) => {
      response.json().then((data) => {
        if(data.authenticated){
          router.push('/dashboard')
        } else {
          router.push('/home')
        }
      })
    })
  }, [])
  
  return <Typography>Redirecting...</Typography>
}