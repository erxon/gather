import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { DataObjectOutlined } from "@mui/icons-material";

export default function Page({ data }) {
  const router = useRouter();
  const [values, setValues] = useState({
    password: "",
    retypePassword: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: "",
  });

  const processResponse = async (response) => {
    const result = await response.json();
    if (response.status === 200) {
      router.push('/login')
    } else {
      setError({ open: true, message: result.error });
    }
  };

  const handleSubmit = async () => {
    //update password
    //redirect user to signin page
    setIsSubmitted(true);
    if (values.password === "" || values.retypePassword === "") {
      return;
    }
    if (values.password === values.retypePassword) {
      //Update password
      const response = await fetch("/api/utility/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.user.username,
          newPassword: values.password,
        }),
      });

      processResponse(response);
    } else {
      setError({ open: true, message: "Password don't match" });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 300 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        New password
      </Typography>
      <TextFieldWithValidation
        isFullWidth={true}
        changeHandler={handleChange}
        label="Password"
        name="password"
        value={values.password}
        type="password"
        style={{ mb: 1 }}
        isSubmitted={isSubmitted}
      />
      <TextFieldWithValidation
        isFullWidth={true}
        changeHandler={handleChange}
        label="Re-type Password"
        name="retypePassword"
        value={values.retypePassword}
        type="password"
        style={{ mb: 1 }}
        isSubmitted={isSubmitted}
      />
      <ErrorAlert
        open={error.open}
        message={error.message}
        close={() => setError({ open: false, message: "" })}
      />
      <Button onClick={handleSubmit}>Done</Button>
    </Paper>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const url = process.env.API_URL || "http://localhost:3000";
  const response = await fetch(`${url}/api/user/${id}`);

  const data = await response.json();

  return {
    props: {
      data: data,
    },
  };
}
