/*
This page displays all reports. Authorities could see
all reports while citizens could only see active reports.
*/
import { useUser } from "@/lib/hooks";
import { useState } from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Grid,
} from "@mui/material";

import { getReports } from "@/lib/api-lib/api-reports";
import StackRowLayout from "@/utils/StackRowLayout";
import ArticleIcon from "@mui/icons-material/Article";
import ReportCard from "@/components/reports/ReportCard";

export default function ReportPage({ data }) {
  const [user, { mutate }] = useUser();
  const [displayData, setDisplayData] = useState(
    data.filter((report) => report.status === "active")
  );
  const handleChange = (event) => {
    if (event.target.value === "all") {
      setDisplayData(data);
    } else {
      setDisplayData(
        data.filter((report) => report.status === event.target.value)
      );
    }
  };
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <StackRowLayout spacing={1}>
          <ArticleIcon />
          <Typography variant="h5">Reports</Typography>
        </StackRowLayout>
      </Box>
      <div>
        {user && user.status === "verified" && user.type === "authority" && (
          <RadioGroup onChange={handleChange} name="filter">
            <StackRowLayout>
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="active"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="closed"
                control={<Radio />}
                label="Closed"
              />
              <FormControlLabel value="all" control={<Radio />} label="All" />
            </StackRowLayout>
          </RadioGroup>
        )}
        <Grid container spacing={2}>
          {displayData.length > 0 ? (
            displayData.map((report) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={report._id}>
                  <ReportCard
                    id={report._id}
                    photo={report.photo}
                    firstName={report.firstName}
                    lastName={report.lastName}
                    lastSeen={report.lastSeen}
                    location={report.reporter && report.reporter.location}
                    age={report.age}
                    gender={report.gender}
                    status={report.status}
                  />
                </Grid>
              );
            })
          ) : (
            <Typography sx={{ mt: 3, p: 3 }} color="GrayText" variant="body1">
              Nothing to show
            </Typography>
          )}
        </Grid>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  //Get all reports
  const data = await getReports();
  return { props: { data } };
};
