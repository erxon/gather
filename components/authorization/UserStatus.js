import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import { CircularProgress, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function UserStatus({ children }) {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <CircularProgress />;
  //if user is unverified return a text: You should be a verified user to access this section.
  if (user && user.status === "unverified") {
    return (
      <div>
        <Typography>
          You should be a verified user to access this section.
        </Typography>
        <Box sx={{mt: 2}}>
          {/*Redirect to profile completion */}
          <Button onClick={() => router.push('/profile/completion')} variant="contained" sx={{ mr: 1 }}>
            Profile
          </Button>
          {/*Logout user*/}
          <Button variant="outlined">Logout</Button>
        </Box>
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
  //if user is verified show the children components
}
