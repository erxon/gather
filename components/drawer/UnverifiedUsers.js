import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

export default function UnverifedUsers() {
  const { data } = useSWR("/api/users", fetcher, { refreshInterval: 1000 });
  const router = useRouter();

  const unverifiedUsers =
    data &&
    data.users.filter((user) => {
      return user.status === "unverified";
    });

  return (
    <List component="div" disablePadding>
      <ListItemButton
        onClick={() => {
          router.push("/users/unverified");
        }}
        sx={{ pl: 4 }}
      >
        <ListItemIcon>
          <Badge badgeContent={unverifiedUsers.length} color="primary">
            <PersonIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Unverified users" />
      </ListItemButton>
    </List>
  );
}
