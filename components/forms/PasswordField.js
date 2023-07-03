import { IconButton, TextField, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

export default function PasswordField({
  name,
  label,
  value,
  handleChange,
  margin,
  styles,
  isSubmitted,
}) {
  const [isVisible, setVisibility] = useState(false);
  const error = value === "" && isSubmitted;
  return (
    <TextField
      error={error}
      helperText={error && "This field is required."}
      sx={styles}
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      margin={margin}
      type={isVisible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setVisibility(!isVisible)}>
              {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
