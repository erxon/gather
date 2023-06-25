import { useUser } from "@/lib/hooks";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Home from "@/components/home/Home";

export default function UserProvider(children) {
  const router = useRouter();
  const [user, { loading }] = useUser();

  if (loading) return <CircularProgress />;

  if (!user) {g
    return (
        <Home />
    )
  }

  if (user) {
    return <div>{children}</div>;
  }
}
