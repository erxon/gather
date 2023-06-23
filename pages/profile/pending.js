import CheckUser from "@/components/CheckUser";

import { Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return (
    <CheckUser>
      <div>
        <Typography variant="h5">Your information will be verified.</Typography>
        <Typography variant="body1">
          Before you could use the features of the system intended for
          authorities, you will be verified first by the administrators
        </Typography>
        <Button
          onClick={() => {
            router.push("/profile/completion");
          }}
          sx={{ mt: 2 }}
        >
          Edit my profile
        </Button>
      </div>
    </CheckUser>
  );
}
