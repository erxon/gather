import { useUser } from "@/lib/hooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CheckUser({ children }) {
  const router = useRouter();
  const [user, { loading }] = useUser();

  useEffect(() => {
    if(!user && !loading){
        router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <CircularProgress />;

  if (user && user.status === "verified") return router.push("/dashboard");

  if (user) return <div>{children}</div>;
}
