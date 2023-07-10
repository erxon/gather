import {
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ProfilePhoto from "../photo/ProfilePhoto";
import { useRouter } from "next/router";

function stringToColor(string) {
  let hash = 0;
  let i;

  let color = "#";

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function characterAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.charAt(0)}`,
  };
}

function ResultCard({ id, name, age, gender, photo }) {
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        router.push(`/reports/${id}`);
      }}
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        p: 2,
        mb: 2,
        height: 60,
      }}
    >
      {photo ? (
        <ProfilePhoto publicId={photo} />
      ) : (
        <Avatar {...characterAvatar(name)} />
      )}
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="subtitle2" color="GrayText">
          {age}, {gender}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SearchBar(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [result, setResult] = useState(props.data);

  const handleChange = (event) => {
    setValue(event.target.value);
    setResult(
      props.data.filter((report) => {
        const name = `${report.firstName} ${report.lastName}`;
        return name.toLowerCase().includes(value.toLowerCase());
      })
    );
    if (event.target.value.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <TextField
        sx={{ maxWidth: 500 }}
        variant="outlined"
        size="small"
        label={props.label}
        name={props.name}
        value={props.value}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Collapse sx={{ position: "absolute" }} in={open}>
        <Paper sx={{ maxWidth: 500, p: 1 }}>
          {result.map((data) => {
            return (
              <ResultCard
                key={data._id}
                id={data._id}
                name={`${data.firstName} ${data.lastName}`}
                age={data.age}
                gender={data.gender}
              />
            );
          })}
          <Button
            onClick={handleClose}
            size="small"
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
        </Paper>
      </Collapse>
    </div>
  );
}
