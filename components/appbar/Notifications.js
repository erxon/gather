import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

export default function Notifications({ handleNotificationsOpen, userId }) {
  const { data } = useSWR(
    `/api/notification/count/contact-${userId}`,
    fetcher,
    {refreshInterval: 1000}
  );
  
  if (data) {console.log(data)}
  return (
    <IconButton
      size="large"
      aria-label="show 17 new notifications"
      color="inherit"
      onClick={handleNotificationsOpen}
    >
      <Badge badgeContent={data ? data.count : 0} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}
