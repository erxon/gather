import Layout from "./Layout";
import { Grid } from "@mui/material";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import MultipleItemField from "./MultipleItemField";
import { useState } from "react";

export default function BasicInformation() {
  const [aliases, setAliases] = useState([]);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    qualifier: "",
    alias: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout head="Basic Information">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            name="firstName"
            variant="standard"
            label="First Name"
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            name="lastName"
            variant="standard"
            label="Last Name"
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            name="middleName"
            variant="standard"
            label="Middle Name"
          />
          <TextFieldWithValidation
            style={{ mb: 2, maxWidth: 100 }}
            name="qualifier"
            variant="standard"
            label="Qualifier"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MultipleItemField
            collection={aliases}
            setCollection={setAliases}
            label={"Known Aliases"}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
