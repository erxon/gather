import { TextField, Stack, Paper, Typography, Grid } from "@mui/material";
import Layout from "./Layout";
import MultipleItemField from "./MultipleItemField";
import { useState } from "react";

function SocialMediaAccounts({ values, setValues }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, socialMediaAccounts: { [name]: value } };
    });
  };
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Social Media Accounts
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Facebook"
          name="facebook"
          value={values.facebook}
          onChange={handleChange}
        />
        <TextField
          label="Twitter"
          name="twitter"
          value={values.twitter}
          onChange={handleChange}
        />
        <TextField
          label="Instagram"
          name="instagram"
          value={values.instagram}
          onChange={handleChange}
        />
      </Stack>
    </Paper>
  );
}

export default function Details(setIsCompleted) {
  const [prostheticsAndImplants, setProstheticsAndImplants] = useState([]);
  const [medications, setMedications] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [smt, setSMT] = useState([]);

  const [values, setValues] = useState({
    currentHairColor: "",
    eyeColor: "",
    bloodType: "",
    lastKnownClothing: "",
    socialMediaAccont: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  return (
    <Layout head="Details">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MultipleItemField
            collection={smt}
            setCollection={setSMT}
            label={"Scars, Marks, & Tattoos"}
          />
          <MultipleItemField
            collection={prostheticsAndImplants}
            setCollection={setProstheticsAndImplants}
            label={"Prosthetics and Implants"}
          />
          <MultipleItemField
            collection={medications}
            setCollection={setMedications}
            label={"Medications"}
          />
          <MultipleItemField
            collection={accessories}
            setCollection={setAccessories}
            label={"Accessories"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            <TextField sx={{ mb: 2 }} label="Current Hair Color" />
            <TextField sx={{ mb: 2 }} label="Eye color" />
            <TextField sx={{ mb: 2 }} label="Blood type (if known)" />
            <TextField sx={{ mb: 2 }} label="Last known clothing" />
          </Stack>
        </Grid>
      </Grid>
      <SocialMediaAccounts
        values={values.socialMediaAccont}
        setValues={setValues}
      />
    </Layout>
  );
}
