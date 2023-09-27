import { TextField, Stack, Paper, Typography, Grid } from "@mui/material";
import Layout from "./Layout";
import MultipleItemField from "./MultipleItemField";
import { useState } from "react";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";

function SocialMediaAccounts({ formValues, setFormValues }) {
  const { facebook, twitter, instagram } =
    formValues.details.socialMediaAccounts;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      details: {
        ...formValues.details,
        socialMediaAccounts: {
          ...formValues.details.socialMediaAccounts,
          [name]: value,
        },
      },
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
          value={facebook}
          onChange={handleChange}
        />
        <TextField
          label="Twitter"
          name="twitter"
          value={twitter}
          onChange={handleChange}
        />
        <TextField
          label="Instagram"
          name="instagram"
          value={instagram}
          onChange={handleChange}
        />
      </Stack>
    </Paper>
  );
}

export default function Details({
  setFormValues,
  formValues,
  collections,
  setCollections,
  isSubmitted,
}) {
  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      details: { ...formValues.details, [name]: value },
    });
  };

  return (
    <Layout head="Details">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MultipleItemField
            collectionName="smt"
            collection={collections.smt}
            collections={collections}
            setCollections={setCollections}
            label={"Scars, Marks, & Tattoos"}
          />
          <MultipleItemField
            collectionName="prostheticsAndImplants"
            collection={collections.prostheticsAndImplants}
            collections={collections}
            setCollections={setCollections}
            label={"Prosthetics and Implants"}
          />
          <MultipleItemField
            collectionName="medications"
            collection={collections.medications}
            collections={collections}
            setCollections={setCollections}
            label={"Medications"}
          />
          <MultipleItemField
            collectionName="accessories"
            collection={collections.accessories}
            collections={collections}
            setCollections={setCollections}
            label={"Accessories"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            <TextFieldWithValidation
              name="currentHairColor"
              isSubmitted={isSubmitted}
              value={formValues.details.currentHairColor}
              changeHandler={handleInput}
              style={{ mb: 2 }}
              label="Current Hair Color"
            />
            <TextFieldWithValidation
              name="eyeColor"
              isSubmitted={isSubmitted}
              value={formValues.details.eyeColor}
              changeHandler={handleInput}
              style={{ mb: 2 }}
              label="Eye color"
            />
            <TextField
              name="bloodType"
              value={formValues.details.bloodType}
              onChange={handleInput}
              sx={{ mb: 2 }}
              label="Blood type (if known)"
            />
            <TextFieldWithValidation
              name="lastKnownClothing"
              isSubmitted={isSubmitted}
              value={formValues.details.lastKnownClothing}
              changeHandler={handleInput}
              label="Last known clothing"
            />
          </Stack>
        </Grid>
      </Grid>
      <SocialMediaAccounts
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </Layout>
  );
}
