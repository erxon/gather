import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, CircularProgress } from "@mui/material";

export default function Authenticate({ children }) {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user.type !== "authority" || user.status === "unverified")
    return <Typography>Forbidden</Typography>;
  if (user) return children;
}
