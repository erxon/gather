import SectionHeader from "@/utils/SectionHeader";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { useState } from "react";
import useSWR from "swr";

import AddIcon from "@mui/icons-material/Add";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";
import { fetcher } from "@/lib/hooks";

function Task({ name, done }) {
  const [checked, isChecked] = useState(done);

  const handleChange = (event) => {
    isChecked(event.target.checked);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Checkbox onChange={handleChange} checked={checked} />
      <Typography variant="body2">{name}</Typography>
    </Stack>
  );
}

function CreateTask({ setTasks }) {
  const [task, setTask] = useState({
    name: "",
    done: false,
  });

  const handleChange = (event) => {
    setTask((prev) => {
      return { ...prev, name: event.target.value };
    });
  };

  const onAdd = () => {
    setTasks((prev) => {
      return {
        ...prev,
        list: [...prev.list, task],
      };
    });
    setTask({
      name: "",
      done: false,
    });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        fullWidth
        value={task.name}
        onChange={handleChange}
        placeholder="Enter a task here"
        variant="standard"
      />
      <IconButton onClick={onAdd}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}

export default function Tasks({ reportId }) {
  const [date, setDate] = useState(new Date());
  const time = ampmTimeFormat(date);
  const [task, setTask] = useState({
    name: "",
    done: false,
  });
  const [tasks, setTasks] = useState({
    date: "",
    list: [
      {
        id: 0,
        name: "Yeah, yeah",
        done: false,
      },
      {
        id: 1,
        name: "Hey, hey",
        done: true,
      },
    ],
  });
  const { data, error, isLoading } = useSWR(
    `/api/reports/management/tasks/${reportId}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching tasks</Typography>;
  if (isLoading) return <CircularProgress />;
  console.log(data);
  return (
    <Paper sx={{ mt: 1, p: 3 }}>
      <SectionHeader icon={<ChecklistIcon />} title="Tasks" />
      <Typography sx={{ mt: 1 }}>
        {date.toDateString()} {time}
      </Typography>
      <Box sx={{ my: 2, maxHeight: 200, overflowY: "scroll" }}>
        {tasks.list.map((item) => {
          return <Task name={item.name} done={item.done} />;
        })}
      </Box>
      <CreateTask setTasks={setTasks} />
    </Paper>
  );
}
