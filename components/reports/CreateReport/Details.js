import {
  TextField,
  Stack,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import Layout from "./Layout";
import MultipleItemField from "./MultipleItemField";
import { useState } from "react";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
  dentalAndFingerprint,
  setDentalAndFingerprint,
}) {
  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      details: { ...formValues.details, [name]: value },
    });
  };

  const dentalAndFingerprintField = (event) => {
    if (!event.target.files[0]) return;
    if (event.target.files[0].size < 500000) {
      setDentalAndFingerprint(event.target.files[0]);
    } else {
      console.log("The file size exceeds 500 kilobytes");
    }
  };

  const cancelFile = () => {
    setDentalAndFingerprint(null);
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
          <MultipleItemField
            collectionName="birthDefects"
            collection={collections.birthDefects}
            collections={collections}
            setCollections={setCollections}
            label={"Birth Defects"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            {/*Current Hair Color*/}
            <TextFieldWithValidation
              name="currentHairColor"
              isSubmitted={isSubmitted}
              value={formValues.details.currentHairColor}
              changeHandler={handleInput}
              style={{ mb: 2 }}
              label="Current Hair Color (Required)"
            />
            {/*Eye Color*/}
            <TextFieldWithValidation
              name="eyeColor"
              isSubmitted={isSubmitted}
              value={formValues.details.eyeColor}
              changeHandler={handleInput}
              style={{ mb: 2 }}
              label="Eye color (Required)"
            />
            {/*Bloodtype*/}
            <TextField
              name="bloodType"
              value={formValues.details.bloodType}
              onChange={handleInput}
              sx={{ mb: 2 }}
              label="Blood type (if known)"
            />
            {/*Last Known Clothing*/}
            <TextFieldWithValidation
              name="lastKnownClothing"
              isSubmitted={isSubmitted}
              value={formValues.details.lastKnownClothing}
              changeHandler={handleInput}
              label="Last known clothing (Required)"
            />
            <Paper variant="outlined" sx={{ mt: 2, mb: 2, p: 2 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }} variant="body2">
                Dental and Fingerprint records
              </Typography>
              <Typography variant="body2">
                Add a file that contains the dental and fingerprint records of
                the missing or found person
              </Typography>
              {dentalAndFingerprint && (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography color="GrayText" variant="body2">
                    {dentalAndFingerprint.name}
                  </Typography>
                  <IconButton onClick={cancelFile}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
              <Button startIcon={<AddIcon />} size="small" component="label">
                {dentalAndFingerprint ? "Change" : "Add"}
                <input
                  hidden
                  name="file"
                  type="file"
                  onChange={dentalAndFingerprintField}
                  accept=".jpg, .jpeg, .png, .pdf, .docx, .doc"
                />
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      {/*Social Media Accounts*/}
      <SocialMediaAccounts
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </Layout>
  );
}
