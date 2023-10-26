import { useEffect, useState } from "react";
import TextFieldWithValidation from "./TextFieldWithValidation";

export default function AgeField({
  isSubmitted,
  changeHandler,
  value,
  style,
  name,
  label,
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNaN(Number(value))) {
      setError({ error: true, message: "Age should be a number" });
    } else {
      setError(null);
    }
  }, [value]);

  return (
    <TextFieldWithValidation
      customError={error}
      isSubmitted={isSubmitted}
      changeHandler={changeHandler}
      value={value}
      style={style}
      name={name}
      label={label}
    />
  );
}
