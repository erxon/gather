import { Grid, Typography, Stack } from "@mui/material";
import { useState } from "react";
import ProfilePhoto from "./ProfilePhoto";
import Fields from "./Fields";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import Attachment from "./Attachment";

export default function CompletionForm({ user, mutate }) {
  const [accomplished, setAccomplished] = useState({
    photo: user && user.photo === "" ? false : true,
    form: false,
  });

  const updatedAt = new Date(user.updatedAt);
  const elapsedTimeSinceLastUpdate = computeElapsedTime(updatedAt);

  return (
    <div>
      {user.updatedAt && (
        <Typography>Updated {elapsedTimeSinceLastUpdate}</Typography>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <ProfilePhoto photo={user.photo} />
          {user.type === "authority" && (
            <Attachment validPhoto={user.validPhoto ? user.validPhoto : null} />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Fields
            user={user}
            mutate={mutate}
            setAccomplished={setAccomplished}
          />
        </Grid>
      </Grid>
    </div>
  );
}
