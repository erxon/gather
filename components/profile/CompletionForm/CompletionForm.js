import { Grid, Typography, Stack, Alert } from "@mui/material";
import { useState } from "react";
import ProfilePhoto from "./ProfilePhoto";
import Fields from "./Fields";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import Attachment from "./Attachment";
import StackRowLayout from "@/utils/StackRowLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CompletionForm({ user, mutate }) {
  const isFormComplete =
    user.firstName !== "" &&
    user.lastName !== "" &&
    user.about !== "" &&
    user.email !== "" &&
    (user.facebook !== "" || user.twitter !== "" || user.instagram !== "");

  const [accomplished, setAccomplished] = useState({
    photo: user && user.photo === "" ? false : true,
    validPhoto:
      user && user.validPhoto && user.validPhoto === "" ? false : true,
    form: isFormComplete,
  });

  const updatedAt = new Date(user.updatedAt);
  const elapsedTimeSinceLastUpdate = computeElapsedTime(updatedAt);

  return (
    <div>
      {accomplished.form && accomplished.photo && accomplished.validPhoto && (
        <Alert sx={{ mb: 2 }} severity="success">
          The form is complete, please wait for verification.
        </Alert>
      )}
      {user.updatedAt && (
        <Typography sx={{ mb: 1 }} variant="body2" color="GrayText">
          Updated {elapsedTimeSinceLastUpdate}
        </Typography>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <ProfilePhoto photo={user.photo} setAccomplished={setAccomplished} />
          <Attachment
            validPhoto={user.validPhoto ? user.validPhoto : null}
            setAccomplished={setAccomplished}
          />
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
