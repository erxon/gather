import AssignmentIcon from "@mui/icons-material/Assignment";
import { IconButton, Badge } from "@mui/material";

export default function Assignment({ handleAssignmentOpen }) {
  //get all reports assigned to the user
  
  return (
    <IconButton onClick={handleAssignmentOpen}>
      <Badge badgeContent={0} color="primary">
        <AssignmentIcon />
      </Badge>
    </IconButton>
  );
}
