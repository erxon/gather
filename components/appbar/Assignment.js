import { fetcher } from "@/lib/hooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { IconButton, Badge, CircularProgress, Typography } from "@mui/material";
import useSWR from 'swr';

export default function Assignment({ userId, handleAssignmentOpen }) {
  //get all reports assigned to the user
  const {data, error, isLoading} = useSWR(`/api/reports/assigned-to/${userId}`, fetcher)

  if (isLoading) return <CircularProgress />
  if (error) return <Typography>Something went wrong</Typography>

  const count = data.length;
  
  return (
    <IconButton color="inherit" onClick={handleAssignmentOpen}>
      <Badge badgeContent={count} color="error">
        <AssignmentIcon />
      </Badge>
    </IconButton>
  );
}
