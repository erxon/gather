import CheckUser from "@/components/CheckUser";
import EditIcon from '@mui/icons-material/Edit';

import { Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return (
    <CheckUser>
      <div>
        <Typography variant="h5">Your information will be verified.</Typography>
        <Typography variant="body1">
          Please wait while we verify your account.
        </Typography>
        <Button
          onClick={() => {
            router.push("/profile/completion");
          }}
          startIcon={<EditIcon />}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Edit my profile
        </Button>
      </div>
    </CheckUser>
  );
}
