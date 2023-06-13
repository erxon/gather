import IconTypography from "@/utils/layout/IconTypography";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from '@mui/icons-material/Person';
import {Box}from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { CircularProgress, Typography } from "@mui/material";

export default function ReportDetails(props) {
  const {
    lastSeen,
    age,
    gender
  } = props;

  return (
    <Box>
      <IconTypography Icon={<PlaceIcon />} content={lastSeen} />
      <IconTypography Icon={<PersonIcon />} content={`${age} ${gender}`}/>
    </Box>
  );
}
