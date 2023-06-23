import { Grid, Button, Typography } from "@mui/material";
import { useState } from "react";
import ProfilePhoto from "./ProfilePhoto";
import Fields from "./Fields";
import { useRouter } from "next/router";

export default function CompletionForm({ user }) {
  const router = useRouter();
  const [accomplished, setAccomplished] = useState({
    photo: user.photo === "" ? false : true,
    form: false,
  });

  const isFinished = accomplished.form && accomplished.photo;
  const updatedAt = new Date(user.updatedAt)
  const elapsedTimeSinceLastUpdate = new Date() - updatedAt;
  

  return (
    <div>
      <Button
        onClick={() => router.push("/profile/pending")}
        sx={{ mb: 1 }}
        variant="outlined"
        disabled={!isFinished}
      >
        Submit for verification
      </Button>
      {user.updatedAt && <Typography>Updated {Math.round(elapsedTimeSinceLastUpdate / 60000)}m ago</Typography>}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <ProfilePhoto photo={user.photo} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Fields user={user} setAccomplished={setAccomplished} />
        </Grid>
      </Grid>
    </div>
  );
}
