import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArticleIcon from "@mui/icons-material/Article";
import { useRouter } from "next/router";

export default function TabLayout({
  userType,
  userId,
  reportOwner,
  children,
  reportId,
  index,
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(index);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div>
      <Box
        sx={{ width: "100%", borderBottom: 1, borderColor: "divider", mb: 4 }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <Tab
            onClick={() => {
              handleRoute(`/reports/${reportId}`);
            }}
            icon={<ArticleIcon />}
            label="Overview"
          />
          {(userType === "authority" || userId === reportOwner) && (
            <Tab
              onClick={() => {
                handleRoute(`/reports/report-management/${reportId}`);
              }}
              icon={<ManageAccountsIcon />}
              label="Manage"
            />
          )}
        </Tabs>
      </Box>
      {children}
    </div>
  );
}
