import { TextField } from "@mui/material";

export default function TextFieldWithValidation({
  type,
  label,
  name,
  value,
  changeHandler,
  isSubmitted,
  isFullWidth,
  isMultiline,
  rows,
  style,
  inputProps,
  size,
  customError,
}) {
  const isEmpty = value === "" && isSubmitted;
  let message = isEmpty && "This field is required.";

  if (customError && customError.error){
    message = customError.message;
  }

  return (
    <TextField
      fullWidth={isFullWidth}
      size={size}
      error={isEmpty || (customError && customError.error)}
      helperText={message}
      type={type}
      label={label}
      name={name}
      value={value}
      rows={rows}
      onChange={changeHandler}
      multiline={isMultiline}
      sx={style}
      InputProps={inputProps}
    />
  );
}
