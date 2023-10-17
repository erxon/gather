import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import PasswordField from "@/components/forms/PasswordField";
import { Box, Typography, Stack } from "@mui/material";

export default function SignupForm({ values, setValues, isFormSubmitted }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <Box>
        <Typography variant="h6" color="primary">
          Sign up
        </Typography>
        <Stack sx={{ mb: 2, mt: 2 }}>
          <Stack direction="row" spacing={1}>
            <TextFieldWithValidation
              changeHandler={handleChange}
              name="firstName"
              isSubmitted={isFormSubmitted}
              value={values.firstName}
              label="First name"
            />
            <TextFieldWithValidation
              changeHandler={handleChange}
              name="lastName"
              isSubmitted={isFormSubmitted}
              value={values.lastName}
              label="Last name"
            />
          </Stack>
          <TextFieldWithValidation
            isSubmitted={isFormSubmitted}
            style={{ mt: 1 }}
            label="username"
            variant="outlined"
            type="text"
            name="username"
            changeHandler={handleChange}
            value={values.username}
            required
          />
          <TextFieldWithValidation
            isSubmitted={isFormSubmitted}
            style={{ mt: 1 }}
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            changeHandler={handleChange}
            value={values.email}
            required
          />
          <PasswordField
            styles={{ mt: 1 }}
            isSubmitted={isFormSubmitted}
            name="password"
            label="Password"
            value={values.password}
            handleChange={handleChange}
          />
          <PasswordField
            styles={{ mt: 1 }}
            isSubmitted={isFormSubmitted}
            name="rpassword"
            label="Repeat Password"
            value={values.rpassword}
            handleChange={handleChange}
          />
        </Stack>
      </Box>
    </>
  );
}
