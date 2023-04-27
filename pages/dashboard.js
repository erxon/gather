import { useUser } from "@/lib/hooks";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import checkAuthUtil from "@/utils/checkAuth.util";
export default function Dashboard() {
  const router = useRouter();
  const [user, { loading }] = useUser();

  useEffect(() => {
    fetch("/api/user/checkAuth").then((response) => {
        response.json().then((data) => {
          if (!data.authenticated) {
            return router.push("/login");
          }
        });
      });
  }, [user]);

  return (
    <>
      <Box>
        <Typography>Dashboard</Typography>
      </Box>
    </>
  );
}
